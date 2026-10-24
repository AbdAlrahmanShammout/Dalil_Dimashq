import { AreaEntity } from '@/modules/area/entity/area.entity';
import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceStatus, PlaceType } from '@/modules/place/enum/general.enum';
import { PlaceRepository } from '@/modules/place/repository/place.repository';
import { PlaceService } from '@/modules/place/place.service';

class MemoryPlaceRepository extends PlaceRepository {
  readonly places: PlaceEntity[] = [];

  async findPublicById(id: string): Promise<PlaceEntity | null> {
    return (
      this.places.find((place) => place.id === id && place.status !== PlaceStatus.Hidden) ?? null
    );
  }

  async countPublic(): Promise<{
    all: number;
    hotels: number;
    restaurants: number;
    cafes: number;
  }> {
    const visible = this.places.filter((place) => place.status !== PlaceStatus.Hidden);
    const hotels = [PlaceType.Hotel, PlaceType.GuestHouse, PlaceType.Hostel, PlaceType.Motel];
    return {
      all: visible.length,
      hotels: visible.filter((place) => hotels.includes(place.type)).length,
      restaurants: visible.filter(
        (place) => place.type === PlaceType.Restaurant || place.type === PlaceType.FastFood,
      ).length,
      cafes: visible.filter((place) => place.type === PlaceType.Cafe).length,
    };
  }

  async listFeatured(): Promise<PlaceEntity[]> {
    return this.places.filter((place) => place.isFeatured && place.status !== PlaceStatus.Hidden);
  }
}

function buildPlace(status: PlaceStatus): PlaceEntity {
  const place = new PlaceEntity({
    id: 'place-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    nameAr: 'بيت',
    nameEn: 'House',
    type: PlaceType.Cafe,
    status,
    areaId: 'area-1',
    addressAr: 'شارع',
    addressEn: 'Street',
    latitude: 33.5,
    longitude: 36.3,
    isFeatured: true,
    starValue: 4,
    starSource: 'tourism',
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

describe('PlaceService', () => {
  it('hides a hidden place', async () => {
    const repository = new MemoryPlaceRepository();
    repository.places.push(buildPlace(PlaceStatus.Hidden));
    await expect(new PlaceService(repository).getPublicPlace('place-1')).rejects.toMatchObject({
      code: 'not_found',
    });
  });

  it('returns a visible place', async () => {
    const repository = new MemoryPlaceRepository();
    repository.places.push(buildPlace(PlaceStatus.Active));
    const actual = await new PlaceService(repository).getPublicPlace('place-1');
    expect(actual.nameEn).toBe('House');
    expect(actual.type).toBe(PlaceType.Cafe);
    const counts = await new PlaceService(repository).countPublicPlaces();
    expect(counts).toEqual({ all: 1, hotels: 0, restaurants: 0, cafes: 1 });
    const featured = await new PlaceService(repository).listFeaturedPlaces();
    expect(featured).toHaveLength(1);
  });
});
