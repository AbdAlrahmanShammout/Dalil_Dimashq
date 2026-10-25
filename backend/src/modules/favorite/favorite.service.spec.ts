import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { FavoriteService } from '@/modules/favorite/favorite.service';
import { FavoriteRepository } from '@/modules/favorite/repository/favorite.repository';
import { PlaceService } from '@/modules/place/place.service';

class MemoryFavoriteRepository extends FavoriteRepository {
  readonly saved = new Set<string>();

  async add(_userId: string, placeId: string): Promise<void> {
    this.saved.add(placeId);
  }

  async remove(_userId: string, placeId: string): Promise<boolean> {
    return this.saved.delete(placeId);
  }

  async list(): Promise<{ id: string; nameAr: string; nameEn: string; type: string }[]> {
    return [...this.saved].map((id) => ({ id, nameAr: 'مقهى', nameEn: 'Cafe', type: 'cafe' }));
  }
}

describe('FavoriteService', () => {
  const places = {
    getPublicPlace: async (id: string) => {
      if (id === 'hidden') {
        throw new ResourceNotFoundException('Place', id);
      }
      return { id };
    },
  } as unknown as PlaceService;

  it('saves a visible place and removes it', async () => {
    const repository = new MemoryFavoriteRepository();
    const service = new FavoriteService(places, repository);
    await service.add('user-1', 'place-1');
    await service.add('user-1', 'place-1');
    expect(await service.list('user-1')).toHaveLength(1);
    await expect(service.add('user-1', 'hidden')).rejects.toMatchObject({ code: 'not_found' });
    const removed = await service.remove('user-1', 'place-1');
    expect(removed.removed).toBe(true);
  });
});
