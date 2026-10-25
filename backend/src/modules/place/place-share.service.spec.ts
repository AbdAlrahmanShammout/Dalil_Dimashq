import { AreaEntity } from '@/modules/area/entity/area.entity';
import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceStatus, PlaceType } from '@/modules/place/enum/general.enum';
import { PlaceShareService } from '@/modules/place/place-share.service';
import { PlaceService } from '@/modules/place/place.service';
import { PlaceCounts, PlaceRepository } from '@/modules/place/repository/place.repository';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';

class MemoryPlaceRepository extends PlaceRepository {
  async findPublicById(): Promise<PlaceEntity> {
    const place = new PlaceEntity({
      id: 'place-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      nameAr: 'مقهى',
      nameEn: 'Cafe',
      type: PlaceType.Cafe,
      status: PlaceStatus.Active,
      areaId: 'area-1',
      addressAr: 'شارع',
      addressEn: 'Street',
      latitude: null,
      longitude: null,
      isFeatured: false,
      starValue: null,
      starSource: null,
      phone: null,
      website: null,
      email: null,
      facebook: null,
      instagram: null,
    });
    place.area = new AreaEntity({
      id: 'area-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      nameAr: 'المزة',
      nameEn: 'Mazzeh',
    });
    return place;
  }

  async countPublic(): Promise<PlaceCounts> {
    return { all: 0, hotels: 0, restaurants: 0, cafes: 0 };
  }

  async listFeatured(): Promise<PlaceEntity[]> {
    return [];
  }
}

class MemoryStorage extends PhotoStorage {
  async createReadUrl(key: string): Promise<string> {
    return `https://files.test/${key}`;
  }
}

describe('PlaceShareService', () => {
  it('returns title, description, and no image bytes', async () => {
    const repository = new MemoryPlaceRepository();
    const actual = await new PlaceShareService(
      new PlaceService(repository),
      repository,
      new MemoryStorage(),
    ).readShare('place-1');
    expect(actual).toEqual({ title: 'مقهى', description: 'شارع', imageUrl: null });
  });
});
