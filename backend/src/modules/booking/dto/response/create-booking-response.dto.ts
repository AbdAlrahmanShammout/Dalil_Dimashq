import { ApiProperty } from '@nestjs/swagger';

import { BookingRecord } from '@/modules/booking/repository/booking.repository';

export class CreateBookingResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly number: number;

  @ApiProperty()
  readonly status: string;

  constructor(booking: BookingRecord) {
    this.id = booking.id;
    this.number = booking.number;
    this.status = booking.status;
  }
}
