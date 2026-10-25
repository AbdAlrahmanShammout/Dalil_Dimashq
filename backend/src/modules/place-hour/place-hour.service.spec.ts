import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceStatus, PlaceType } from '@/modules/place/enum/general.enum';
import { PlaceRepository } from '@/modules/place/repository/place.repository';
import { PlaceCounts } from '@/modules/place/repository/place.repository';
import { PlaceService } from '@/modules/place/place.service';
import { PlaceHourEntity } from '@/modules/place-hour/entity/place-hour.entity';
import { PlaceHourRepository } from '@/modules/place-hour/repository/place-hour.repository';
import { PlaceHourService } from '@/modules/place-hour/place-hour.service';

class MemoryPlaceRepository extends PlaceRepository {
  async findPublicById(): Promise<PlaceEntity | null> {
    const place = new PlaceEntity({
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
    return place;
  }

  async countPublic(): Promise<PlaceCounts> {
    return { all: 1, hotels: 0, restaurants: 0, cafes: 1 };
  }

  async listFeatured(): Promise<PlaceEntity[]> {
    return [];
  }
}

class MemoryHourRepository extends PlaceHourRepository {
  hours: PlaceHourEntity[] = [];
  ramadan = false;

  async listByPlace(
    _placeId: string,
    season: 'regular' | 'ramadan' = 'regular',
  ): Promise<PlaceHourEntity[]> {
    return this.hours.filter((hour) => hour.season === season);
  }

  async isRamadan(): Promise<boolean> {
    return this.ramadan;
  }
}

describe('PlaceHourService', () => {
  it('returns no label and no week when the place has no hours', async () => {
    const service = new PlaceHourService(
      new PlaceService(new MemoryPlaceRepository()),
      new MemoryHourRepository(),
    );
    expect(await service.readOpenNow('place-1', new Date('2026-10-25T12:00:00Z'))).toEqual({
      openNow: null,
    });
    expect(await service.readWeek('place-1')).toEqual({ week: null, ramadan: null });
  });

  it('decides open now in Damascus time', async () => {
    const hours = new MemoryHourRepository();
    hours.hours.push(
      new PlaceHourEntity({
        id: 'hour-1',
        placeId: 'place-1',
        dayOfWeek: 0,
        opensAt: 9 * 60,
        closesAt: 17 * 60,
      }),
    );
    const service = new PlaceHourService(new PlaceService(new MemoryPlaceRepository()), hours);
    const sundayNoonDamascus = new Date('2026-10-25T09:00:00Z');
    const actual = await service.readOpenNow('place-1', sundayNoonDamascus);
    expect(actual.openNow).toBe(true);
    const week = await service.readWeek('place-1');
    expect(week.week).toHaveLength(7);
    expect(week.week?.[0].periods).toEqual([{ opensAt: 540, closesAt: 1020 }]);
    expect(week.ramadan).toBeNull();
    hours.hours.push(
      new PlaceHourEntity({
        id: 'hour-2',
        placeId: 'place-1',
        dayOfWeek: 0,
        opensAt: 18 * 60,
        closesAt: 23 * 60,
        season: 'ramadan',
      }),
    );
    const outside = await service.readWeek('place-1', new Date('2026-10-25T09:00:00Z'));
    expect(outside.ramadan).toBeNull();
    expect(outside.week?.[0].periods).toEqual([{ opensAt: 540, closesAt: 1020 }]);
    hours.ramadan = true;
    const inside = await service.readWeek('place-1', new Date('2026-10-25T09:00:00Z'));
    expect(inside.week?.[0].periods).toEqual([{ opensAt: 540, closesAt: 1020 }]);
    expect(inside.ramadan?.[0].periods).toEqual([{ opensAt: 1080, closesAt: 1380 }]);
  });
});
