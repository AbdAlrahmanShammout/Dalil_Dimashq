import { HourSeasonName, PlaceHourEntity } from '@/modules/place-hour/entity/place-hour.entity';

export type { HourSeasonName };

export interface RegularHourPeriod {
  readonly dayOfWeek: number;
  readonly opensAt: number;
  readonly closesAt: number;
}

export abstract class PlaceHourRepository {
  abstract listByPlace(placeId: string, season?: HourSeasonName): Promise<PlaceHourEntity[]>;
  abstract isRamadan(now: Date): Promise<boolean>;

  replaceRegular(_placeId: string, _periods: RegularHourPeriod[]): Promise<void> {
    return Promise.reject(new Error('replaceRegular is not implemented'));
  }

  replaceSeason(
    _placeId: string,
    _season: HourSeasonName,
    _periods: RegularHourPeriod[],
  ): Promise<boolean> {
    return Promise.resolve(false);
  }
}
