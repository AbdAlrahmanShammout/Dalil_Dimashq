import { PlaceEntity } from '@/modules/place/entity/place.entity';

export abstract class PlaceRepository {
  abstract findPublicById(id: string): Promise<PlaceEntity | null>;
}
