import { PlacePhotoEntity } from '@/modules/place-photo/entity/place-photo.entity';

export abstract class PlacePhotoRepository {
  abstract listVisible(placeId: string): Promise<PlacePhotoEntity[]>;

  countByPlace(_placeId: string): Promise<number> {
    return Promise.resolve(0);
  }

  create(_input: {
    readonly placeId: string;
    readonly objectKey: string;
  }): Promise<{ id: string; objectKey: string }> {
    return Promise.reject(new Error('create is not implemented'));
  }

  assignRole(_placeId: string, _photoId: string, _role: 'cover' | 'logo'): Promise<boolean> {
    return Promise.resolve(false);
  }

  deleteOwned(_placeId: string, _photoId: string): Promise<{ objectKey: string } | null> {
    return Promise.resolve(null);
  }

  deleteById(_photoId: string): Promise<{ objectKey: string } | null> {
    return Promise.resolve(null);
  }
}
