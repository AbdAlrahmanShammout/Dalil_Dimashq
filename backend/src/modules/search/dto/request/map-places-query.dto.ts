import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { PlaceType } from '@/modules/place/enum/general.enum';
import { PlaceMapSort } from '@/modules/search/defs/place-search-query';

export class MapPlacesQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({ enum: PlaceType })
  @IsOptional()
  @IsEnum(PlaceType)
  type?: PlaceType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  areaId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minimumStars?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === undefined || value === '') {
      return undefined;
    }
    return value === true || value === 'true';
  })
  @IsBoolean()
  hasPhone?: boolean;

  @ApiPropertyOptional({ enum: ['name', 'near'] })
  @IsOptional()
  @IsIn(['name', 'near'])
  sort?: PlaceMapSort;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;
}
