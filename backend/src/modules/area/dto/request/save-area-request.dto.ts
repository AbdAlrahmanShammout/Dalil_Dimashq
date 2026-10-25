import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SaveAreaRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  nameAr!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  nameEn!: string;
}
