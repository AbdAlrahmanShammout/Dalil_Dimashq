import { ApiProperty } from '@nestjs/swagger';

import { RatingRecord, RatingStatusName } from '@/modules/rating/repository/rating.repository';

export class RatingResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly stars: number;

  @ApiProperty()
  readonly status: RatingStatusName;

  constructor(rating: RatingRecord) {
    this.id = rating.id;
    this.stars = rating.stars;
    this.status = rating.status;
  }
}
