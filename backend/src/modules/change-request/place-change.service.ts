import { Injectable } from '@nestjs/common';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import {
  PlaceChangeRecord,
  PlaceChangeRepository,
} from '@/modules/change-request/repository/place-change.repository';
import { PlaceService } from '@/modules/place/place.service';

export interface ReportPlaceInput {
  readonly userId: string;
  readonly placeId: string;
  readonly reason: string;
}

@Injectable()
export class PlaceChangeService {
  constructor(
    private readonly placeChangeRepository: PlaceChangeRepository,
    private readonly placeService: PlaceService,
  ) {}

  /**
   * Opens a report. An empty reason is refused and nothing is stored.
   */
  async reportPlace(input: ReportPlaceInput): Promise<PlaceChangeRecord> {
    await this.placeService.getPublicPlace(input.placeId);
    const reason = input.reason.trim();
    if (!reason) {
      throw new InvalidStateException({ message: 'Reason is required', code: 'reason' });
    }
    return this.placeChangeRepository.create({
      placeId: input.placeId,
      userId: input.userId,
      kind: 'report',
      reason,
      payload: null,
    });
  }

  /**
   * Opens a claim with an empty change set. The place is not linked yet.
   */
  async openClaim(input: {
    readonly userId: string;
    readonly placeId: string;
  }): Promise<PlaceChangeRecord> {
    await this.placeService.getPublicPlace(input.placeId);
    return this.placeChangeRepository.create({
      placeId: input.placeId,
      userId: input.userId,
      kind: 'claim',
      reason: null,
      payload: null,
    });
  }
}
