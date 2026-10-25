import { ApiProperty } from '@nestjs/swagger';

import { BookingRecord } from '@/modules/booking/repository/booking.repository';

export class CreateBookingResponseDto {
  @ApiProperty()
  readonly id: string;

  constructor(booking: BookingRecord) {
    this.id = booking.id;
  }
}
