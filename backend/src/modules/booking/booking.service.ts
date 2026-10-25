import { Injectable } from '@nestjs/common';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { BookingAvailabilityService } from '@/modules/booking/booking-availability.service';
import { assertBookableSlot } from '@/modules/booking/booking-slot';
import { BookingGateService } from '@/modules/booking/booking-gate.service';
import {
  BookingRecord,
  BookingRepository,
  CreateBookingInput,
} from '@/modules/booking/repository/booking.repository';
import { CurrentOfferRepository } from '@/modules/booking/repository/current-offer.repository';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingGateService: BookingGateService,
    private readonly bookingAvailabilityService: BookingAvailabilityService,
    private readonly bookingRepository: BookingRepository,
    private readonly currentOfferRepository: CurrentOfferRepository,
  ) {}

  /**
   * Creates a pending booking. The same client key returns the first booking.
   */
  async create(
    input: Omit<CreateBookingInput, 'offerId'> & {
      readonly requestedOfferId?: string;
      readonly now?: Date;
    },
  ): Promise<BookingRecord> {
    const existing = await this.bookingRepository.findByClientKey(input.userId, input.clientKey);
    if (existing) {
      return existing;
    }
    const now = input.now ?? new Date();
    await this.bookingGateService.assertOpen({
      userId: input.userId,
      placeId: input.placeId,
      now,
    });
    const availability = await this.bookingAvailabilityService.read(input.placeId);
    if (input.partySize > availability.maxParty) {
      throw new InvalidStateException({ message: 'Party is too large', code: 'party_too_large' });
    }
    assertBookableSlot({ startsAt: input.startsAt, now, availability });
    const offerId = input.requestedOfferId
      ? await this.currentOfferRepository.findCurrentId(input.placeId, input.requestedOfferId, now)
      : null;
    return this.bookingRepository.create({ ...input, offerId });
  }
}
