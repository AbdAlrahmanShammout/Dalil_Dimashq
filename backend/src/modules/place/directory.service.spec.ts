import { AreaEntity } from '@/modules/area/entity/area.entity';
import { DirectoryService } from '@/modules/place/directory.service';
import { PlaceType } from '@/modules/place/enum/general.enum';
import { DirectoryPlace, PlaceRepository } from '@/modules/place/repository/place.repository';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';

class MemoryPlaceRepository extends PlaceRepository {
  async findPublicById(): Promise<null> {
    return null;
  }

  async countPublic() {
    return { all: 0, hotels: 0, restaurants: 0, cafes: 0 };
  }

  async listFeatured() {
    return [];
  }

  override async listDirectory(): Promise<DirectoryPlace[]> {
    return [
      {
        id: 'place-1',
        nameAr: 'مقهى',
        nameEn: 'Cafe',
        type: PlaceType.Cafe,
        area: new AreaEntity({
          id: 'area-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          nameAr: 'المزة',
          nameEn: 'Mazzeh',
        }),
        coverKey: null,
      },
    ];
  }
}

class MemoryStorage extends PhotoStorage {
  async createReadUrl(key: string): Promise<string> {
    return `https://files.test/${key}`;
  }
}

describe('DirectoryService', () => {
  it('returns json fields and an empty cover when there is no photo', async () => {
    const actual = await new DirectoryService(
      new MemoryPlaceRepository(),
      new MemoryStorage(),
    ).listDirectory();
    expect(actual[0]).toMatchObject({
      id: 'place-1',
      nameEn: 'Cafe',
      type: 'cafe',
      coverUrl: null,
    });
    expect(actual[0].area.nameEn).toBe('Mazzeh');
  });
});
