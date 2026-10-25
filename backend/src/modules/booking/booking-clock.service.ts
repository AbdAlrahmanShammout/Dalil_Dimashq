import { Injectable } from '@nestjs/common';

import {
  BookingClockRepository,
  PendingBookingClockRow,
} from '@/modules/booking/repository/booking-clock.repository';

export const BOOKING_REPLY_CLOCK_MS = 60_000;
const MINUTE_MS = 60_000;

@Injectable()
export class BookingClockService {
  constructor(private readonly bookingClockRepository: BookingClockRepository) {}

  /**
   * Moves unanswered pending bookings to expired and records the notification.
   */
  async expireDue(now: Date): Promise<number> {
    const pending = await this.bookingClockRepository.listPending();
    const due = pending.filter((row) => this.isDue(row, now));
    if (due.length === 0) {
      return 0;
    }
    await this.bookingClockRepository.expire(due, now);
    return due.length;
  }

  private isDue(row: PendingBookingClockRow, now: Date): boolean {
    return row.createdAt.getTime() + row.replyWindowMinutes * MINUTE_MS <= now.getTime();
  }
}
