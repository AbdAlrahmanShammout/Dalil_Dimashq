import { Injectable } from '@nestjs/common';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/modules/place/enum/general.enum';
import {
  PlaceMapSort,
  PlaceSearchQuery,
  PlaceSearchSort,
} from '@/modules/search/defs/place-search-query';
import {
  MapPoint,
  PlaceSearchPage,
  SearchRepository,
} from '@/modules/search/repository/search.repository';

export interface SearchPlacesServiceInput {
  readonly text?: string;
  readonly type?: PlaceSearchQuery['type'];
  readonly areaId?: string;
  readonly minimumStars?: number;
  readonly hasPhone?: boolean;
  readonly sort?: PlaceSearchSort;
  readonly limit?: number;
  readonly offset?: number;
}

@Injectable()
export class SearchService {
  constructor(private readonly searchRepository: SearchRepository) {}

  /**
   * Public place search. The total uses the same filter as the page.
   */
  async searchPlaces(input: SearchPlacesServiceInput): Promise<PlaceSearchPage> {
    const limit = input.limit ?? DEFAULT_PAGE_LIMIT;
    const offset = input.offset ?? DEFAULT_PAGE_OFFSET;
    const sort = input.sort ?? 'completeness';
    return this.searchRepository.search({
      text: input.text,
      type: input.type,
      areaId: input.areaId,
      minimumStars: input.minimumStars,
      hasPhone: input.hasPhone,
      sort,
      limit,
      offset,
    });
  }

  /**
   * Map points for the same filters as search. Near-me uses stored coordinates only.
   */
  async listMapPoints(input: {
    text?: string;
    type?: PlaceSearchQuery['type'];
    areaId?: string;
    minimumStars?: number;
    hasPhone?: boolean;
    sort?: PlaceMapSort;
    latitude?: number;
    longitude?: number;
  }): Promise<MapPoint[]> {
    const sort = input.sort ?? 'name';
    if (sort === 'near' && (input.latitude === undefined || input.longitude === undefined)) {
      throw new InvalidStateException({
        message: 'A coordinate is required to sort by distance',
        code: 'near_coordinate_required',
      });
    }
    return this.searchRepository.listMap({
      text: input.text,
      type: input.type,
      areaId: input.areaId,
      minimumStars: input.minimumStars,
      hasPhone: input.hasPhone,
      sort,
      latitude: input.latitude,
      longitude: input.longitude,
    });
  }
}
