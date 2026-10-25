import { Injectable } from '@nestjs/common';

import { AccessDeniedException } from '@/common/exceptions/access-denied.exception';
import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { BookingAvailabilityService } from '@/modules/booking/booking-availability.service';
import { BookingBanRepository } from '@/modules/booking/repository/booking-ban.repository';

@Injectable()
export class BookingGateService {
  constructor(
    private readonly bookingAvailabilityService: BookingAvailabilityService,
    private readonly bookingBanRepository: BookingBanRepository,
  ) {}

  /**
   * A booking needs a place that accepts them and a visitor who is not banned.
   */
  async assertOpen(input: {
    readonly userId: string;
    readonly placeId: string;
    readonly now?: Date;
  }): Promise<void> {
    const now = input.now ?? new Date();
    const availability = await this.bookingAvailabilityService.read(input.placeId);
    if (!availability.acceptsBookings) {
      throw new InvalidStateException({ message: 'Bookings are closed', code: 'booking_closed' });
    }
    const ban = await this.bookingBanRepository.findActive(input.userId, now);
    if (ban) {
      throw new AccessDeniedException({ message: 'Booking is banned', code: 'booking_banned' });
    }
  }
}
