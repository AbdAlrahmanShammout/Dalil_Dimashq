import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

import { PlaceStatus, PlaceType } from '@/modules/place/enum/general.enum';

const PLACE_TYPES = Object.values(PlaceType);
const PLACE_STATUSES = Object.values(PlaceStatus);

export class SaveStaffPlaceRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  nameAr!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  nameEn!: string;

  @ApiProperty({ enum: PLACE_TYPES })
  @IsIn(PLACE_TYPES)
  type!: PlaceType;

  @ApiProperty({ enum: PLACE_STATUSES })
  @IsIn(PLACE_STATUSES)
  status!: PlaceStatus;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  areaId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressAr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionEn?: string;
}
