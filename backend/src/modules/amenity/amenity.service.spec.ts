import { PlaceAmenityEntity } from '@/modules/amenity/entity/place-amenity.entity';
import { AmenityRepository } from '@/modules/amenity/repository/amenity.repository';
import { AmenityService } from '@/modules/amenity/amenity.service';
import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceStatus, PlaceType } from '@/modules/place/enum/general.enum';
import { PlaceCounts, PlaceRepository } from '@/modules/place/repository/place.repository';
import { PlaceService } from '@/modules/place/place.service';

class MemoryPlaceRepository extends PlaceRepository {
  async findPublicById(): Promise<PlaceEntity> {
    return new PlaceEntity({
      id: 'place-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      nameAr: 'بيت',
      nameEn: 'House',
      type: PlaceType.Cafe,
      status: PlaceStatus.Active,
      areaId: 'area-1',
      addressAr: null,
      addressEn: null,
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
  }

  async countPublic(): Promise<PlaceCounts> {
    return { all: 0, hotels: 0, restaurants: 0, cafes: 0 };
  }

  async listFeatured(): Promise<PlaceEntity[]> {
    return [];
  }
}

class MemoryAmenityRepository extends AmenityRepository {
  async listByPlace(): Promise<PlaceAmenityEntity[]> {
    return [
      new PlaceAmenityEntity({
        code: 'wifi',
        nameAr: 'واي فاي',
        nameEn: 'Wifi',
        sortOrder: 1,
        approved: true,
      }),
    ];
  }
}

describe('AmenityService', () => {
  it('returns approved chips', async () => {
    const actual = await new AmenityService(
      new PlaceService(new MemoryPlaceRepository()),
      new MemoryAmenityRepository(),
    ).listApproved('place-1');
    expect(actual.map((item) => item.code)).toEqual(['wifi']);
  });
});
