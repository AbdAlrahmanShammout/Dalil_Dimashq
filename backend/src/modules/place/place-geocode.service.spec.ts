import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceStatus, PlaceType } from '@/modules/place/enum/general.enum';
import { PlaceGeocodeService } from '@/modules/place/place-geocode.service';
import {
  PlaceCounts,
  PlaceRepository,
  SaveGeocodeRepoInput,
  SaveGeocodeResult,
} from '@/modules/place/repository/place.repository';

class MemoryPlaceRepository extends PlaceRepository {
  saved: SaveGeocodeRepoInput | null = null;

  async findPublicById(): Promise<PlaceEntity | null> {
    return null;
  }

  override async findAnyById(): Promise<PlaceEntity> {
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
      addressAr: 'قديم',
      addressEn: 'Old',
      latitude: 33.5,
      longitude: 36.3,
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

  override async saveGeocode(input: SaveGeocodeRepoInput): Promise<SaveGeocodeResult> {
    this.saved = input;
    return input;
  }
}

describe('PlaceGeocodeService', () => {
  it('stores a successful coordinate and clears the failure', async () => {
    const repository = new MemoryPlaceRepository();
    const maps = { geocodeAddress: jest.fn(async () => ({ latitude: 33.51, longitude: 36.29 })) };
    const actual = await new PlaceGeocodeService(repository, maps as never).saveAddress({
      placeId: 'place-1',
      address: 'Mazzeh',
    });
    expect(maps.geocodeAddress).toHaveBeenCalledTimes(1);
    expect(actual.latitude).toBe(33.51);
    expect(actual.geocodeFailedAt).toBeNull();
  });

  it('keeps the previous coordinate when geocoding fails', async () => {
    const repository = new MemoryPlaceRepository();
    const maps = {
      geocodeAddress: jest.fn(async () => {
        throw new Error('down');
      }),
    };
    const actual = await new PlaceGeocodeService(repository, maps as never).saveAddress({
      placeId: 'place-1',
      address: 'Mazzeh',
    });
    expect(actual.latitude).toBe(33.5);
    expect(actual.longitude).toBe(36.3);
    expect(actual.geocodeFailedAt).toBeInstanceOf(Date);
  });
});
