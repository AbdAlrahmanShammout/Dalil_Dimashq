import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { EventEntity } from '@/modules/event/entity/event.entity';
import { EventPage, EventRepository } from '@/modules/event/repository/event.repository';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/modules/place/enum/general.enum';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';

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
