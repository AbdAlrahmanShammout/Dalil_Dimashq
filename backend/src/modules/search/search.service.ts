import { Injectable } from '@nestjs/common';

import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/modules/place/enum/general.enum';
import { PlaceSearchQuery, PlaceSearchSort } from '@/modules/search/defs/place-search-query';
import { PlaceSearchPage, SearchRepository } from '@/modules/search/repository/search.repository';

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
}
