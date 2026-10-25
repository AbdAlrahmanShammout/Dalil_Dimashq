import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MinLength } from 'class-validator';

export class FeaturePlaceRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  placeId!: string;
}

export class UpdateFeaturedRequestDto {
  @ApiProperty()
  @IsBoolean()
  featured!: boolean;
}
