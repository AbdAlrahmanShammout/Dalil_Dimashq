import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SetBookingEnabledRequestDto {
  @ApiProperty()
  @IsBoolean()
  enabled!: boolean;
}
