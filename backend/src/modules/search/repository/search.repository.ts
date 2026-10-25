import { PlaceType } from '@/modules/place/enum/general.enum';
import { PlaceEntity } from '@/modules/place/entity/place.entity';
import { PlaceMapSort, PlaceSearchQuery } from '@/modules/search/defs/place-search-query';

export interface PlaceSearchPage {
  readonly items: PlaceEntity[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
}

export interface MapPoint {
  readonly id: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly type: PlaceType;
}

export interface PlaceMapQuery {
  readonly text?: string;
  readonly type?: PlaceType;
  readonly areaId?: string;
  readonly minimumStars?: number;
  readonly hasPhone?: boolean;
  readonly sort: PlaceMapSort;
  readonly latitude?: number;
  readonly longitude?: number;
}

export abstract class SearchRepository {
  abstract search(query: PlaceSearchQuery): Promise<PlaceSearchPage>;
  abstract listMap(query: PlaceMapQuery): Promise<MapPoint[]>;
}
