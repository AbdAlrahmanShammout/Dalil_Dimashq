import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { EventEntity } from '@/modules/event/entity/event.entity';
import {
  EventPage,
  EventRepository,
  StaffEventWrite,
} from '@/modules/event/repository/event.repository';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/modules/place/enum/general.enum';
import { prepareOwnerPhoto } from '@/modules/place-photo/owner-photo-rules';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';

interface StaffEventFields {
  readonly placeId: string | null;
  readonly titleAr: string;
  readonly titleEn: string;
  readonly descriptionAr: string;
  readonly descriptionEn: string;
  readonly addressAr: string | null;
  readonly addressEn: string | null;
  readonly phone: string | null;
  readonly published: boolean;
  readonly startsAt: Date;
}

interface EventPoster {
  readonly fileName: string;
  readonly mimeType: string;
  readonly bytes: Uint8Array;
}

export interface EventView {
  readonly id: string;
  readonly titleAr: string;
  readonly titleEn: string;
  readonly descriptionAr: string;
  readonly descriptionEn: string;
  readonly addressAr: string | null;
  readonly addressEn: string | null;
  readonly phone: string | null;
  readonly posterUrl: string | null;
  readonly startsAt: Date;
  readonly placeId: string | null;
}

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly photoStorage: PhotoStorage,
  ) {}

  /**
   * Published events, soonest first.
   */
  async listPublished(input: { limit?: number; offset?: number }): Promise<{
    items: EventView[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const page = await this.eventRepository.listPublished(
      input.limit ?? DEFAULT_PAGE_LIMIT,
      input.offset ?? DEFAULT_PAGE_OFFSET,
    );
    return this.withPosters(page);
  }

  /**
   * One published event, including the linked public place when it has one.
   */
  async getPublished(id: string): Promise<EventView> {
    const event = await this.eventRepository.findPublishedById(id);
    if (!event) {
      throw new ResourceNotFoundException('Event', id);
    }
    return this.toView(event);
  }

  /**
   * Creates an event. A poster is uploaded before the row is stored.
   */
  async createStaff(input: StaffEventFields & { poster?: EventPoster }): Promise<{ id: string }> {
    const posterKey = input.poster ? await this.storePoster(input.placeId, input.poster) : null;
    try {
      return await this.eventRepository.createStaff(toWrite(input, posterKey));
    } catch (error) {
      if (posterKey) {
        await this.photoStorage.deleteObject(posterKey);
      }
      throw error;
    }
  }

  /**
   * Updates an event. A new poster replaces the stored object.
   */
  async updateStaff(id: string, input: StaffEventFields & { poster?: EventPoster }): Promise<void> {
    const posterKey = input.poster
      ? await this.storePoster(input.placeId, input.poster)
      : undefined;
    const previous = await this.eventRepository.updateStaff(id, toWrite(input, posterKey));
    if (previous === null) {
      if (posterKey) {
        await this.photoStorage.deleteObject(posterKey);
      }
      throw new ResourceNotFoundException('Event', id);
    }
    if (posterKey && previous && previous !== posterKey) {
      await this.photoStorage.deleteObject(previous);
    }
  }

  /**
   * Deletes an event and its poster object.
   */
  async deleteStaff(id: string): Promise<void> {
    const previous = await this.eventRepository.deleteStaff(id);
    if (previous === null) {
      throw new ResourceNotFoundException('Event', id);
    }
    if (previous) {
      await this.photoStorage.deleteObject(previous);
    }
  }

  private async storePoster(placeId: string | null, poster: EventPoster): Promise<string> {
    const prepared = prepareOwnerPhoto({
      placeId: placeId ?? 'events',
      fileName: poster.fileName,
      mimeType: poster.mimeType,
      byteLength: poster.bytes.byteLength,
      existingCount: 0,
    });
    await this.photoStorage.uploadObject({
      key: prepared.key,
      body: poster.bytes,
      contentType: poster.mimeType,
    });
    return prepared.key;
  }

  private async withPosters(page: EventPage): Promise<{
    items: EventView[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const items = await Promise.all(page.items.map((event) => this.toView(event)));
    return { items, total: page.total, limit: page.limit, offset: page.offset };
  }

  private async toView(event: EventEntity): Promise<EventView> {
    const posterUrl = event.posterKey
      ? await this.photoStorage.createReadUrl(event.posterKey)
      : null;
    return {
      id: event.id,
      titleAr: event.titleAr,
      titleEn: event.titleEn,
      descriptionAr: event.descriptionAr,
      descriptionEn: event.descriptionEn,
      addressAr: event.addressAr,
      addressEn: event.addressEn,
      phone: event.phone,
      posterUrl,
      startsAt: event.startsAt,
      placeId: event.place ? event.place.id : null,
    };
  }
}

function toWrite(input: StaffEventFields, posterKey: string | null | undefined): StaffEventWrite {
  return {
    placeId: input.placeId,
    titleAr: input.titleAr,
    titleEn: input.titleEn,
    descriptionAr: input.descriptionAr,
    descriptionEn: input.descriptionEn,
    addressAr: input.addressAr,
    addressEn: input.addressEn,
    phone: input.phone,
    published: input.published,
    startsAt: input.startsAt,
    ...(posterKey !== undefined ? { posterKey } : {}),
  };
}
