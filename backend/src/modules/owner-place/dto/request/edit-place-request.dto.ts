import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { PlaceType } from '@/modules/place/enum/general.enum';

const PLACE_TYPES = Object.values(PlaceType);

export class EditPlaceRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nameAr?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiPropertyOptional({ enum: PLACE_TYPES })
  @IsOptional()
  @IsIn(PLACE_TYPES)
  type?: PlaceType;

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
  tourismClass?: string;
}
