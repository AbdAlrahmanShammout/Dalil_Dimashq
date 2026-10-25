import { Injectable } from '@nestjs/common';

import {
  BookingSettingsRepository,
  OwnerBookingSettings,
} from '@/modules/booking/repository/booking-settings.repository';

@Injectable()
export class OwnerBookingSettingsService {
  constructor(private readonly bookingSettingsRepository: BookingSettingsRepository) {}

  /**
   * Accepting, max party, and minimum notice. Missing rows use the stored defaults.
   */
  async read(placeId: string): Promise<OwnerBookingSettings> {
    return this.bookingSettingsRepository.readOwner(placeId);
  }

  /**
   * Saves accepting and max party. A null notice leaves the stored minimum notice.
   */
  async save(input: {
    readonly placeId: string;
    readonly acceptsBookings: boolean;
    readonly maxParty: number;
    readonly noticeMinutes: number | null;
  }): Promise<OwnerBookingSettings> {
    return this.bookingSettingsRepository.saveOwner(input);
  }
}
