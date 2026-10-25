import { Injectable } from '@nestjs/common';

import { ConflictException } from '@/common/exceptions/conflict.exception';
import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
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
}
