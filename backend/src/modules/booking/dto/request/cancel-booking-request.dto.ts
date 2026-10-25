import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CancelBookingRequestDto {
  @ApiProperty()
  @IsString()
  reason!: string;
}
