import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, MinLength } from 'class-validator';

export class DecideRatingRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  ratingId!: string;

  @ApiProperty({ enum: ['counted', 'rejected'] })
  @IsIn(['counted', 'rejected'])
  decision!: 'counted' | 'rejected';
}
