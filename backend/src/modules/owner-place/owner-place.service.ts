import { Injectable } from '@nestjs/common';

import {
  OwnedPlaceSummary,
  PlaceOwnerRepository,
} from '@/modules/owner-place/repository/place-owner.repository';

@Injectable()
export class OwnerPlaceService {
  constructor(private readonly placeOwnerRepository: PlaceOwnerRepository) {}

  /**
   * Places linked to this owner account.
   */
  async listMine(userId: string): Promise<OwnedPlaceSummary[]> {
    return this.placeOwnerRepository.listByUser(userId);
  }
}
