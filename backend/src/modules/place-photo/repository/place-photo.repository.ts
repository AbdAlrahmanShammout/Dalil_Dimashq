import { PlacePhotoEntity } from '@/modules/place-photo/entity/place-photo.entity';

export abstract class PlacePhotoRepository {
  abstract listVisible(placeId: string): Promise<PlacePhotoEntity[]>;

  countByPlace(_placeId: string): Promise<number> {
    return Promise.resolve(0);
  }
}
