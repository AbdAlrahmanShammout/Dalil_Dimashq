import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FakeBookingReportRequestDto {
  @ApiProperty()
  @IsString()
  reason!: string;
}
