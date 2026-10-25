import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { BookingAvailabilityService } from '@/modules/booking/booking-availability.service';
import { assertBookableSlot } from '@/modules/booking/booking-slot';
import { BookingGateService } from '@/modules/booking/booking-gate.service';
import {
  BookingDetail,
  BookingListItem,
  BookingRecord,
  BookingRepository,
  BOOKING_PAGE_LIMIT,
  CreateBookingInput,
  ListBookingsInput,
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

  /**
   * Every status belonging to the caller, with the unfiltered total.
   */
  async listMine(input: ListBookingsInput): Promise<{ rows: BookingListItem[]; total: number }> {
    return this.bookingRepository.listForUser({
      userId: input.userId,
      limit: input.limit || BOOKING_PAGE_LIMIT,
      offset: input.offset,
    });
  }

  /**
   * One booking for its owner. Another visitor's id is not found.
   */
  async readMine(userId: string, bookingId: string): Promise<BookingDetail> {
    const booking = await this.bookingRepository.findOwned(userId, bookingId);
    if (!booking) {
      throw new ResourceNotFoundException('Booking', bookingId);
    }
    return booking;
  }

  /**
   * Cancels the caller's booking before the appointment.
   */
  async cancelMine(
    userId: string,
    bookingId: string,
    now: Date = new Date(),
  ): Promise<BookingDetail> {
    const booking = await this.readMine(userId, bookingId);
    if (booking.startsAt.getTime() <= now.getTime()) {
      throw new InvalidStateException({ message: 'The appointment has started', code: 'too_late' });
    }
    const updated = await this.bookingRepository.markCancelledByCustomer(userId, bookingId);
    if (!updated) {
      throw new InvalidStateException({
        message: 'This booking cannot be cancelled',
        code: 'booking_not_cancellable',
      });
    }
    return updated;
  }
}
