import { PlaceAmenityEntity } from '@/modules/amenity/entity/place-amenity.entity';

export abstract class AmenityRepository {
  abstract listByPlace(placeId: string): Promise<PlaceAmenityEntity[]>;
}
