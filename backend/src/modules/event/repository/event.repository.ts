import { EventEntity } from '@/modules/event/entity/event.entity';

export interface EventPage {
  readonly items: EventEntity[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
}

export abstract class EventRepository {
  abstract listPublished(limit: number, offset: number): Promise<EventPage>;
  abstract findPublishedById(id: string): Promise<EventEntity | null>;
}
