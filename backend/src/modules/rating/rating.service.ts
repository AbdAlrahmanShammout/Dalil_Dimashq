import { Injectable } from '@nestjs/common';

import { ConflictException } from '@/common/exceptions/conflict.exception';
import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { PlaceService } from '@/modules/place/place.service';
import { RatingRecord, RatingRepository } from '@/modules/rating/repository/rating.repository';
import { UserService } from '@/modules/user/user.service';

export interface CreateRatingInput {
  readonly userId: string;
  readonly placeId: string;
  readonly stars: number;
}

@Injectable()
export class RatingService {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly placeService: PlaceService,
    private readonly userService: UserService,
  ) {}

  /**
   * Stores one held rating. An unverified phone stores nothing.
   */
  async create(input: CreateRatingInput): Promise<RatingRecord> {
    await this.placeService.getPublicPlace(input.placeId);
    const verified = await this.userService.hasVerifiedPhone(input.userId);
    if (!verified) {
      throw new InvalidStateException({
        message: 'Phone is not verified',
        code: 'phone_unverified',
      });
    }
    const existing = await this.ratingRepository.findByVisitor(input.userId, input.placeId);
    if (existing) {
      throw new ConflictException({ message: 'Rating already exists', code: 'conflict' });
    }
    return this.ratingRepository.create(input);
  }

  /**
   * Counts a rating and refreshes the public score from counted rows only.
   */
  async countRating(ratingId: string): Promise<void> {
    const rating = await this.requireRating(ratingId);
    await this.ratingRepository.markStatus(rating.id, 'counted');
    await this.refreshPublicScore(rating.placeId);
  }

  /**
   * Rejects a rating. Held and rejected rows stay out of the public score.
   */
  async rejectRating(ratingId: string): Promise<void> {
    const rating = await this.requireRating(ratingId);
    await this.ratingRepository.markStatus(rating.id, 'rejected');
  }

  /**
   * Counts or rejects a rating that is still held. A decided rating stays as it is.
   */
  async decideHeld(ratingId: string, decision: 'counted' | 'rejected'): Promise<void> {
    const rating = await this.requireRating(ratingId);
    if (rating.status !== 'held') {
      throw new InvalidStateException({ message: 'Already decided', code: 'invalid_state' });
    }
    if (decision === 'counted') {
      await this.countRating(ratingId);
      return;
    }
    await this.rejectRating(ratingId);
  }

  private async refreshPublicScore(placeId: string): Promise<void> {
    const counted = await this.ratingRepository.listCounted(placeId);
    if (counted.length === 0) {
      await this.placeService.applyVisitorScore(placeId, null);
      return;
    }
    const total = counted.reduce((sum, row) => sum + row.stars, 0);
    const starValue = Math.round(total / counted.length);
    await this.placeService.applyVisitorScore(placeId, starValue);
  }

  private async requireRating(ratingId: string): Promise<RatingRecord> {
    const rating = await this.ratingRepository.findById(ratingId);
    if (!rating) {
      throw new ResourceNotFoundException('Rating', ratingId);
    }
    return rating;
  }
}
