import { Injectable } from '@nestjs/common';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { BookingAvailabilityService } from '@/modules/booking/booking-availability.service';
import { BookingGateService } from '@/modules/booking/booking-gate.service';
import {
  BookingRecord,
  BookingRepository,
  CreateBookingInput,
} from '@/modules/booking/repository/booking.repository';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingGateService: BookingGateService,
    private readonly bookingAvailabilityService: BookingAvailabilityService,
    private readonly bookingRepository: BookingRepository,
  ) {}

  /**
   * Creates a pending booking. The same client key returns the first booking.
   */
  async create(input: CreateBookingInput & { readonly now?: Date }): Promise<BookingRecord> {
    const existing = await this.bookingRepository.findByClientKey(input.userId, input.clientKey);
    if (existing) {
      return existing;
    }
    await this.bookingGateService.assertOpen({
      userId: input.userId,
      placeId: input.placeId,
      now: input.now,
    });
    const availability = await this.bookingAvailabilityService.read(input.placeId);
    if (input.partySize > availability.maxParty) {
      throw new InvalidStateException({ message: 'Party is too large', code: 'party_too_large' });
    }
    return this.bookingRepository.create(input);
  }
}
