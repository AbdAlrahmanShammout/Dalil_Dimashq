import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

import { PlaceType } from '@/modules/place/enum/general.enum';
import { PlaceSearchSort } from '@/modules/search/defs/place-search-query';

export class SearchPlacesQueryDto {
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

  @ApiPropertyOptional({ enum: ['completeness', 'name'] })
  @IsOptional()
  @IsIn(['completeness', 'name'])
  sort?: PlaceSearchSort;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
