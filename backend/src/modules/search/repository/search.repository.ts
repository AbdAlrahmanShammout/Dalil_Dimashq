import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceSearchQuery } from '@/modules/search/defs/place-search-query';

export interface PlaceSearchPage {
  readonly items: PlaceEntity[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
}

export abstract class SearchRepository {
  abstract search(query: PlaceSearchQuery): Promise<PlaceSearchPage>;
}
