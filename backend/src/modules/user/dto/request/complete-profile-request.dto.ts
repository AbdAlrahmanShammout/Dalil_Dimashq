import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString, Max, Min } from 'class-validator';

import { ProfileLanguage } from '@/modules/user/enum/general.enum';

export class CompleteProfileRequestDto {
  @ApiProperty({ example: 'Ahmad' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Ali' })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: '0944000000' })
  @IsString()
  phone!: string;

  @ApiProperty({ example: 2000 })
  @IsInt()
  @Min(1900)
  @Max(2100)
  birthYear!: number;

  @ApiProperty({ enum: ProfileLanguage })
  @IsEnum(ProfileLanguage)
  language!: ProfileLanguage;
}
