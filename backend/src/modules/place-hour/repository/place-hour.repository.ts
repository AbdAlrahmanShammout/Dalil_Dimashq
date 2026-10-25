import { HourSeasonName, PlaceHourEntity } from '@/modules/place-hour/entity/place-hour.entity';

export abstract class PlaceHourRepository {
  abstract listByPlace(placeId: string, season?: HourSeasonName): Promise<PlaceHourEntity[]>;
  abstract isRamadan(now: Date): Promise<boolean>;
}
