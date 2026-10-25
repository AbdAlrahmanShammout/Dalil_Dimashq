import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { BOOKING_NOTE_MAX_LENGTH } from '@/modules/booking/repository/booking.repository';

export class CreateBookingRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  clientKey!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  placeId!: string;

  @ApiProperty()
  @IsDateString()
  startsAt!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  partySize!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(BOOKING_NOTE_MAX_LENGTH)
  note?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  offerId?: string;
}
