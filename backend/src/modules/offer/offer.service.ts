import { Injectable } from '@nestjs/common';

import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/modules/place/enum/general.enum';
import { PlaceService } from '@/modules/place/place.service';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';
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
