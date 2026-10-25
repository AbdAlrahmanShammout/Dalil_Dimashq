import { RecentPlaceService } from '@/modules/recent-view/recent-place.service';
import {
  RecentPlaceRepository,
  RecentPlaceSummary,
} from '@/modules/recent-view/repository/recent-place.repository';
import { PlaceService } from '@/modules/place/place.service';

class MemoryRecentPlaceRepository extends RecentPlaceRepository {
  readonly rows: Array<{ placeId: string; viewedAt: Date }> = [];

  async record(_userId: string, placeId: string, viewedAt: Date): Promise<void> {
    const existing = this.rows.find((row) => row.placeId === placeId);
    if (existing) {
      existing.viewedAt = viewedAt;
      return;
    }
    this.rows.push({ placeId, viewedAt });
  }

  async list(): Promise<RecentPlaceSummary[]> {
    return [...this.rows]
      .sort((left, right) => right.viewedAt.getTime() - left.viewedAt.getTime())
      .map((row) => ({
        id: row.placeId,
        nameAr: 'مقهى',
        nameEn: 'Cafe',
        type: 'cafe',
        viewedAt: row.viewedAt,
      }));
  }
}

describe('RecentPlaceService', () => {
  const places = {
    getPublicPlace: async (id: string) => ({ id }),
  } as unknown as PlaceService;

  it('keeps one row per place and lists the latest open first', async () => {
    const repository = new MemoryRecentPlaceRepository();
    const service = new RecentPlaceService(places, repository);
    await service.record('user-1', 'place-1', new Date('2026-10-25T08:00:00Z'));
    await service.record('user-1', 'place-2', new Date('2026-10-25T09:00:00Z'));
    await service.record('user-1', 'place-1', new Date('2026-10-25T10:00:00Z'));
    const actual = await service.list('user-1');
    expect(repository.rows).toHaveLength(2);
    expect(actual.map((place) => place.id)).toEqual(['place-1', 'place-2']);
  });
});
