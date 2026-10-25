import { Injectable } from '@nestjs/common';

import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/modules/place/enum/general.enum';
import {
  OwnedPlaceSummary,
  PlaceNamePage,
  PlaceOwnerRepository,
} from '@/modules/owner-place/repository/place-owner.repository';

@Injectable()
export class OwnerPlaceService {
  constructor(private readonly placeOwnerRepository: PlaceOwnerRepository) {}

  /**
   * Places linked to this owner account.
   */
  async listMine(userId: string, now: Date = new Date()): Promise<OwnedPlaceSummary[]> {
    return this.placeOwnerRepository.listByUser(userId, now);
  }

  /**
   * Name search used before a place is linked. Hidden places stay out.
   */
  async searchByName(input: {
    readonly name: string;
    readonly limit?: number;
    readonly offset?: number;
  }): Promise<PlaceNamePage> {
    return this.placeOwnerRepository.searchByName({
      name: input.name.trim(),
      limit: input.limit ?? DEFAULT_PAGE_LIMIT,
      offset: input.offset ?? DEFAULT_PAGE_OFFSET,
    });
  }
}
