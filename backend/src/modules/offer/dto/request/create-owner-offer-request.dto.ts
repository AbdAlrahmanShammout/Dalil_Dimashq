import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, MinLength } from 'class-validator';

export class CreateOwnerOfferRequestDto {
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
  detailsAr!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  detailsEn!: string;

  @ApiProperty()
  @IsDateString()
  startsAt!: string;

  @ApiProperty()
  @IsDateString()
  endsAt!: string;
}
