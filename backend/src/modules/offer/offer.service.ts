import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/modules/place/enum/general.enum';
import { PlaceService } from '@/modules/place/place.service';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';
import { assertOfferWindow, prepareOfferImage } from '@/modules/offer/offer-rules';
import { OfferEntity } from '@/modules/offer/entity/offer.entity';
import { OfferPage, OfferRepository } from '@/modules/offer/repository/offer.repository';

export interface OfferView {
  readonly id: string;
  readonly placeId: string;
  readonly titleAr: string;
  readonly titleEn: string;
  readonly detailsAr: string;
  readonly detailsEn: string;
  readonly imageUrl: string | null;
  readonly until: Date;
}

export interface OfferViewPage {
  readonly items: OfferView[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
}

@Injectable()
export class OfferService {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly placeService: PlaceService,
    private readonly photoStorage: PhotoStorage,
  ) {}

  /**
   * Current published offers for the public banner.
   */
  async listCurrentOffers(input: {
    limit?: number;
    offset?: number;
    now?: Date;
  }): Promise<OfferViewPage> {
    const page = await this.offerRepository.listCurrent(this.query(input));
    return this.withImages(page);
  }

  /**
   * Current offers for one public place.
   */
  async listPlaceOffers(
    placeId: string,
    input: { limit?: number; offset?: number; now?: Date },
  ): Promise<OfferViewPage> {
    await this.placeService.getPublicPlace(placeId);
    const page = await this.offerRepository.listCurrentForPlace(placeId, this.query(input));
    return this.withImages(page);
  }

  /**
   * Creates an owner offer. The image, when present, is uploaded by the API.
   */
  async createOwnerOffer(input: {
    readonly placeId: string;
    readonly titleAr: string;
    readonly titleEn: string;
    readonly detailsAr: string;
    readonly detailsEn: string;
    readonly startsAt: Date;
    readonly endsAt: Date;
    readonly image?: { fileName: string; mimeType: string; bytes: Uint8Array };
  }): Promise<{ id: string }> {
    assertOfferWindow(input.startsAt, input.endsAt);
    let imageKey: string | null = null;
    if (input.image) {
      const prepared = prepareOfferImage({
        placeId: input.placeId,
        fileName: input.image.fileName,
        mimeType: input.image.mimeType,
        byteLength: input.image.bytes.byteLength,
      });
      await this.photoStorage.uploadObject({
        key: prepared.key,
        body: input.image.bytes,
        contentType: input.image.mimeType,
      });
      imageKey = prepared.key;
    }
    return this.offerRepository.create({
      placeId: input.placeId,
      titleAr: input.titleAr,
      titleEn: input.titleEn,
      detailsAr: input.detailsAr,
      detailsEn: input.detailsEn,
      imageKey,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
    });
  }

  /**
   * Ends the offer now.
   */
  async stopOwnerOffer(placeId: string, offerId: string, now: Date = new Date()): Promise<void> {
    const stopped = await this.offerRepository.stop(placeId, offerId, now);
    if (!stopped) {
      throw new ResourceNotFoundException('Offer', offerId);
    }
  }

  /**
   * Removes the offer and its stored image.
   */
  async deleteOwnerOffer(placeId: string, offerId: string): Promise<void> {
    const removed = await this.offerRepository.deleteOwned(placeId, offerId);
    if (!removed) {
      throw new ResourceNotFoundException('Offer', offerId);
    }
    if (removed.imageKey) {
      await this.photoStorage.deleteObject(removed.imageKey);
    }
  }

  /**
   * Staff removal. Premium is not required.
   */
  async deleteForStaff(offerId: string): Promise<void> {
    const removed = await this.offerRepository.deleteById(offerId);
    if (!removed) {
      throw new ResourceNotFoundException('Offer', offerId);
    }
    if (removed.imageKey) {
      await this.photoStorage.deleteObject(removed.imageKey);
    }
  }

  private query(input: { limit?: number; offset?: number; now?: Date }) {
    return {
      limit: input.limit ?? DEFAULT_PAGE_LIMIT,
      offset: input.offset ?? DEFAULT_PAGE_OFFSET,
      now: input.now ?? new Date(),
    };
  }

  private async withImages(page: OfferPage): Promise<OfferViewPage> {
    const items = await Promise.all(page.items.map((offer) => this.toView(offer)));
    return { items, total: page.total, limit: page.limit, offset: page.offset };
  }

  private async toView(offer: OfferEntity): Promise<OfferView> {
    const imageUrl = offer.imageKey ? await this.photoStorage.createReadUrl(offer.imageKey) : null;
    return {
      id: offer.id,
      placeId: offer.placeId,
      titleAr: offer.titleAr,
      titleEn: offer.titleEn,
      detailsAr: offer.detailsAr,
      detailsEn: offer.detailsEn,
      imageUrl,
      until: offer.endsAt,
    };
  }
}
