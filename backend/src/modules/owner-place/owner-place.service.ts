import { Injectable } from '@nestjs/common';

import { AccessDeniedException } from '@/common/exceptions/access-denied.exception';
import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/modules/place/enum/general.enum';
import {
  OwnedPlaceSummary,
  OwnerPlaceDetail,
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

  /**
   * Links the owner immediately when the code starts with DD- and matches the place.
   */
  async claimWithCode(input: {
    readonly userId: string;
    readonly placeId: string;
    readonly code: string;
  }): Promise<void> {
    const place = await this.placeOwnerRepository.findClaimTarget(input.placeId);
    if (!place) {
      throw new ResourceNotFoundException('Place', input.placeId);
    }
    const matches = input.code.startsWith('DD-') && input.code === place.claimCode;
    if (!matches) {
      throw new InvalidStateException({ message: 'Invalid code', code: 'invalid_code' });
    }
    await this.placeOwnerRepository.linkOwner(input.userId, input.placeId);
  }

  /**
   * Refuses a place route when this owner is not linked. Claim and search do not call this.
   */
  async assertLinked(userId: string, placeId: string): Promise<void> {
    const linked = await this.placeOwnerRepository.isLinked(userId, placeId);
    if (!linked) {
      throw new AccessDeniedException({ message: 'Not linked', code: 'not_linked' });
    }
  }

  /**
   * Owner summary for a linked place: both names, type, and address.
   */
  async readSummary(userId: string, placeId: string): Promise<OwnerPlaceDetail> {
    await this.assertLinked(userId, placeId);
    const place = await this.placeOwnerRepository.findDetail(placeId);
    if (!place) {
      throw new ResourceNotFoundException('Place', placeId);
    }
    return place;
  }
}
