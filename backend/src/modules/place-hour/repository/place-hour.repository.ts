import { PlaceHourEntity } from '@/modules/place-hour/entity/place-hour.entity';

export abstract class PlaceHourRepository {
  abstract listByPlace(placeId: string): Promise<PlaceHourEntity[]>;
}
