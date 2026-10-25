import { ApiProperty } from '@nestjs/swagger';

import { BookingAvailability } from '@/modules/booking/repository/booking-settings.repository';

class ClosedPeriodResponseDto {
  @ApiProperty()
  readonly startsAt: string;

  @ApiProperty()
  readonly endsAt: string;

  constructor(startsAt: Date, endsAt: Date) {
    this.startsAt = startsAt.toISOString();
    this.endsAt = endsAt.toISOString();
  }
}

export class BookingAvailabilityResponseDto {
  @ApiProperty()
  readonly acceptsBookings: boolean;

  @ApiProperty()
  readonly horizonDays: number;

  @ApiProperty()
  readonly noticeMinutes: number;

  @ApiProperty()
  readonly maxParty: number;

  @ApiProperty({ type: [ClosedPeriodResponseDto] })
  readonly closedPeriods: ClosedPeriodResponseDto[];

  constructor(availability: BookingAvailability) {
    this.acceptsBookings = availability.acceptsBookings;
    this.horizonDays = availability.horizonDays;
    this.noticeMinutes = availability.noticeMinutes;
    this.maxParty = availability.maxParty;
    this.closedPeriods = availability.closedPeriods.map(
      (period) => new ClosedPeriodResponseDto(period.startsAt, period.endsAt),
    );
  }
}
