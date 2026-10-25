import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

import { RATING_STAR_MAX, RATING_STAR_MIN } from '@/modules/rating/repository/rating.repository';

export class CreateRatingRequestDto {
  @ApiProperty({ minimum: RATING_STAR_MIN, maximum: RATING_STAR_MAX })
  @IsInt()
  @Min(RATING_STAR_MIN)
  @Max(RATING_STAR_MAX)
  stars!: number;
}
