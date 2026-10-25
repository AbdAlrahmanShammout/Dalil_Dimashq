import { EventEntity } from '@/modules/event/entity/event.entity';
import { EventService } from '@/modules/event/event.service';
import { EventPage, EventRepository } from '@/modules/event/repository/event.repository';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';

class MemoryEventRepository extends EventRepository {
  async listPublished(limit: number, offset: number): Promise<EventPage> {
    return {
      items: [
        new EventEntity({
          id: 'event-1',
          placeId: null,
          titleAr: 'حدث',
          titleEn: 'Night',
          descriptionAr: 'وصف',
          descriptionEn: 'Description',
          addressAr: 'عنوان',
          addressEn: 'Address',
          phone: '+963944000000',
          posterKey: null,
          startsAt: new Date('2026-11-01T18:00:00Z'),
        }),
      ],
      total: 1,
      limit,
      offset,
    };
  }

  async findPublishedById(): Promise<EventEntity | null> {
    return null;
  }
}

class MemoryStorage extends PhotoStorage {
  async createReadUrl(key: string): Promise<string> {
    return `https://files.test/${key}`;
  }
}

describe('EventService', () => {
  it('lists a published event without a poster url', async () => {
    const actual = await new EventService(
      new MemoryEventRepository(),
      new MemoryStorage(),
    ).listPublished({});
    expect(actual.total).toBe(1);
    expect(actual.items[0].posterUrl).toBeNull();
    expect(actual.items[0].placeId).toBeNull();
    expect(actual.limit).toBe(20);
  });
});
