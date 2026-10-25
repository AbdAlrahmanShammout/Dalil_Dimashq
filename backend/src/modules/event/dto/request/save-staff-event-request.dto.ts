import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class SaveStaffEventRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  placeId?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  titleAr!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  titleEn!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  descriptionAr!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  descriptionEn!: string;

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

  @ApiProperty()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  published!: boolean;

  @ApiProperty()
  @IsDateString()
  startsAt!: string;
}
