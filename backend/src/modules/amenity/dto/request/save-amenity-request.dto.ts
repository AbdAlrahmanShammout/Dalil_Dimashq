import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class SaveAmenityRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  code!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  nameAr!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  nameEn!: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  sortOrder!: number;
}
