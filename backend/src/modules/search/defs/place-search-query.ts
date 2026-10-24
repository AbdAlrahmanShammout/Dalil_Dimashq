import { PlaceType } from '@/modules/place/enum/general.enum';

export type PlaceSearchSort = 'completeness' | 'name';

export interface PlaceSearchQuery {
  readonly text?: string;
  readonly type?: PlaceType;
  readonly areaId?: string;
  readonly minimumStars?: number;
  readonly hasPhone?: boolean;
  readonly sort: PlaceSearchSort;
  readonly limit: number;
  readonly offset: number;
}
