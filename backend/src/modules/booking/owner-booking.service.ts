import { Injectable } from '@nestjs/common';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import {
  BookingRepository,
  DecideBookingInput,
  OwnerBookingRow,
  PlaceBooking,
} from '@/modules/booking/repository/booking.repository';

@Injectable()
export class OwnerBookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  /**
   * Bookings for a linked place, with the visitor name, phone, and report flag.
   */
  async listForPlace(placeId: string): Promise<OwnerBookingRow[]> {
    return this.bookingRepository.listForPlace(placeId);
  }

  /**
   * Confirms a pending booking.
   */
  async confirm(placeId: string, bookingId: string): Promise<void> {
    await this.requirePending(placeId, bookingId);
    await this.applyDecision({
      placeId,
      bookingId,
      status: 'confirmed',
      fromStatuses: ['pending'],
    });
  }

  /**
   * Rejects a pending booking. The reason is optional.
   */
  async reject(placeId: string, bookingId: string, reason: string | null): Promise<void> {
    await this.requirePending(placeId, bookingId);
    const trimmed = reason?.trim() ?? '';
    await this.applyDecision({
      placeId,
      bookingId,
      status: 'rejected',
      fromStatuses: ['pending'],
      rejectionReason: trimmed.length > 0 ? trimmed : null,
    });
  }

  private async requirePending(placeId: string, bookingId: string): Promise<PlaceBooking> {
    const booking = await this.loadPlaceBooking(placeId, bookingId);
    if (booking.status !== 'pending') {
      throw new InvalidStateException({ message: 'Already answered', code: 'booking_answered' });
    }
    return booking;
  }

  private async loadPlaceBooking(placeId: string, bookingId: string): Promise<PlaceBooking> {
    const booking = await this.bookingRepository.findForPlace(placeId, bookingId);
    if (!booking) {
      throw new ResourceNotFoundException('Booking', bookingId);
    }
    return booking;
  }

  private async applyDecision(input: DecideBookingInput): Promise<void> {
    const updated = await this.bookingRepository.decide(input);
    if (!updated) {
      throw new InvalidStateException({ message: 'Already answered', code: 'booking_answered' });
    }
  }
}
