import { Injectable } from '@nestjs/common';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import {
  BookingRepository,
  DecideBookingInput,
  OwnerBookingRow,
  PlaceBooking,
} from '@/modules/booking/repository/booking.repository';

const ATTENDANCE_LEAD_MS = 30 * 60 * 1000;
const ATTENDANCE_GRACE_MS = 3 * 24 * 60 * 60 * 1000;

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

  /**
   * Cancels a confirmed booking that has not started. A reason is required.
   */
  async cancel(
    placeId: string,
    bookingId: string,
    reason: string,
    now: Date = new Date(),
  ): Promise<void> {
    const trimmed = reason.trim();
    if (!trimmed) {
      throw new InvalidStateException({
        message: 'Reason is required',
        code: 'booking_cancel_reason',
      });
    }
    const booking = await this.loadPlaceBooking(placeId, bookingId);
    if (booking.status !== 'confirmed') {
      throw new InvalidStateException({
        message: 'Only a confirmed booking can be cancelled',
        code: 'booking_cancel_confirmed',
      });
    }
    if (booking.startsAt.getTime() <= now.getTime()) {
      throw new InvalidStateException({
        message: 'Too late to cancel',
        code: 'booking_cancel_late',
      });
    }
    await this.applyDecision({
      placeId,
      bookingId,
      status: 'cancelled_by_owner',
      fromStatuses: ['confirmed'],
      cancellationReason: trimmed,
    });
  }

  /**
   * Marks attended or no-show from 30 minutes before the booking until 3 days after.
   */
  async markAttendance(
    placeId: string,
    bookingId: string,
    result: string | null,
    now: Date = new Date(),
  ): Promise<void> {
    if (result !== 'attended' && result !== 'no_show') {
      throw new InvalidStateException({
        message: 'Attendance is required',
        code: 'booking_mark_missing',
      });
    }
    const booking = await this.loadPlaceBooking(placeId, bookingId);
    if (booking.status !== 'confirmed') {
      throw new InvalidStateException({
        message: 'Only a confirmed booking can be marked',
        code: 'booking_mark_confirmed',
      });
    }
    const start = booking.startsAt.getTime();
    const tooEarly = now.getTime() < start - ATTENDANCE_LEAD_MS;
    const tooLate = now.getTime() > start + ATTENDANCE_GRACE_MS;
    if (tooEarly || tooLate) {
      throw new InvalidStateException({
        message: 'Outside the attendance window',
        code: 'booking_mark_window',
      });
    }
    await this.applyDecision({
      placeId,
      bookingId,
      status: result,
      fromStatuses: ['confirmed'],
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
