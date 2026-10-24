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
  });
});
