import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceSearchQuery } from '@/modules/search/defs/place-search-query';
import { PlaceSearchPage, SearchRepository } from '@/modules/search/repository/search.repository';
import { SearchService } from '@/modules/search/search.service';

class MemorySearchRepository extends SearchRepository {
  lastQuery: PlaceSearchQuery | null = null;

  async search(query: PlaceSearchQuery): Promise<PlaceSearchPage> {
    this.lastQuery = query;
    return { items: [] as PlaceEntity[], total: 0, limit: query.limit, offset: query.offset };
  }

  async listMap(): Promise<never[]> {
    return [];
  }
}

describe('SearchService', () => {
  it('defaults the page and sorts by completeness', async () => {
    const repository = new MemorySearchRepository();
    await new SearchService(repository).searchPlaces({});
    expect(repository.lastQuery).toMatchObject({
      sort: 'completeness',
      limit: 20,
      offset: 0,
    });
  });

  it('refuses a near sort that has no coordinate', async () => {
    const repository = new MemorySearchRepository();
    await expect(
      new SearchService(repository).listMapPoints({ sort: 'near' }),
    ).rejects.toMatchObject({
      code: 'near_coordinate_required',
    });
  });
});
