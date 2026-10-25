import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class OpenBookingRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  placeId!: string;
}
