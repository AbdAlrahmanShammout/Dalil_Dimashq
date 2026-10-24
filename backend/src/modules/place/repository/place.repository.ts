import { PlaceEntity } from '@/modules/place/entity/place.entity';

export interface PlaceCounts {
  readonly all: number;
  readonly hotels: number;
  readonly restaurants: number;
  readonly cafes: number;
}

export abstract class PlaceRepository {
  abstract findPublicById(id: string): Promise<PlaceEntity | null>;
  abstract countPublic(): Promise<PlaceCounts>;
}
