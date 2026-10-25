import { ApiProperty } from '@nestjs/swagger';

import { OwnerBookingSettings } from '@/modules/booking/repository/booking-settings.repository';

export class OwnerBookingSettingsResponseDto {
  @ApiProperty()
  readonly acceptsBookings: boolean;

  @ApiProperty()
  readonly maxParty: number;

  @ApiProperty()
  readonly noticeMinutes: number;

  constructor(settings: OwnerBookingSettings) {
    this.acceptsBookings = settings.acceptsBookings;
    this.maxParty = settings.maxParty;
    this.noticeMinutes = settings.noticeMinutes;
  }
}
