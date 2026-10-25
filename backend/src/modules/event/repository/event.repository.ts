import { EventEntity } from '@/modules/event/entity/event.entity';

export interface EventPage {
  readonly items: EventEntity[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
}

export interface StaffEventWrite {
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
  readonly posterKey?: string | null;
}

export abstract class EventRepository {
  abstract listPublished(limit: number, offset: number): Promise<EventPage>;
  abstract findPublishedById(id: string): Promise<EventEntity | null>;

  createStaff(_input: StaffEventWrite): Promise<{ id: string }> {
    return Promise.reject(new Error('createStaff is not implemented'));
  }

  updateStaff(_id: string, _input: StaffEventWrite): Promise<string | null> {
    return Promise.resolve(null);
  }

  deleteStaff(_id: string): Promise<string | null> {
    return Promise.resolve(null);
  }
}
