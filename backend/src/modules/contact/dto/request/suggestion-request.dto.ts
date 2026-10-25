import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { SUGGESTION_KINDS } from '@/modules/contact/repository/suggestion.repository';

export class SuggestionRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  contact!: string;

  @ApiProperty({ enum: SUGGESTION_KINDS })
  @IsIn(SUGGESTION_KINDS)
  kind!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  message!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  placeId?: string;
}
