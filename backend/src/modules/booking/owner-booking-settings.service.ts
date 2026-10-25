import { Injectable } from '@nestjs/common';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import {
  BookingSettingsRepository,
  OwnerBookingSettings,
} from '@/modules/booking/repository/booking-settings.repository';

const MINUTES_IN_DAY = 24 * 60;

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

  /**
   * Switches booking on or off without opening a review request.
   */
  async setEnabled(placeId: string, enabled: boolean): Promise<void> {
    const saved = await this.bookingSettingsRepository.setAcceptsBookings(placeId, enabled);
    if (!saved) {
      throw new ResourceNotFoundException('Place', placeId);
    }
  }

  /**
   * Adds a weekday reply window. The row is live; it is not a review request.
   */
  async addResponseHour(input: {
    readonly placeId: string;
    readonly dayOfWeek: number;
    readonly opensAt: number;
    readonly closesAt: number;
  }): Promise<{ id: string }> {
    const validDay = input.dayOfWeek >= 0 && input.dayOfWeek <= 6;
    const validWindow =
      input.opensAt >= 0 && input.closesAt <= MINUTES_IN_DAY && input.opensAt < input.closesAt;
    if (!validDay || !validWindow) {
      throw new InvalidStateException({
        message: 'Reply hours are invalid',
        code: 'hours_invalid',
      });
    }
    return this.bookingSettingsRepository.addResponseHour(input);
  }

  /**
   * Removes one reply window that belongs to the place.
   */
  async removeResponseHour(placeId: string, hourId: string): Promise<void> {
    const removed = await this.bookingSettingsRepository.deleteResponseHour(placeId, hourId);
    if (!removed) {
      throw new ResourceNotFoundException('BookingResponseHour', hourId);
    }
  }

  /**
   * Adds a closed range. The row is live; it is not a review request.
   */
  async addBlackout(input: {
    readonly placeId: string;
    readonly startsAt: Date;
    readonly endsAt: Date;
  }): Promise<{ id: string }> {
    if (input.endsAt.getTime() <= input.startsAt.getTime()) {
      throw new InvalidStateException({
        message: 'Closed range is invalid',
        code: 'invalid_state',
      });
    }
    return this.bookingSettingsRepository.addBlackout(input);
  }

  /**
   * Removes one closed range that belongs to the place.
   */
  async removeBlackout(placeId: string, blackoutId: string): Promise<void> {
    const removed = await this.bookingSettingsRepository.deleteBlackout(placeId, blackoutId);
    if (!removed) {
      throw new ResourceNotFoundException('BookingBlackout', blackoutId);
    }
  }
}
