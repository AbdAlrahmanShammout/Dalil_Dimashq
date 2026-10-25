import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ProfileLanguage } from '@/modules/user/enum/general.enum';

export class UpdateProfileRequestDto {
  @ApiPropertyOptional({ example: '0944111111' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: ProfileLanguage })
  @IsOptional()
  @IsEnum(ProfileLanguage)
  language?: ProfileLanguage;
}
