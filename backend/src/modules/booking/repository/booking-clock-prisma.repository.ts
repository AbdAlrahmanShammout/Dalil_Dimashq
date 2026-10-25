import { Injectable } from '@nestjs/common';

import {
  BookingClockRepository,
  PendingBookingClockRow,
} from '@/modules/booking/repository/booking-clock.repository';
import { DEFAULT_BOOKING_REPLY_MINUTES } from '@/modules/booking/repository/booking-settings.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class BookingClockPrismaRepository extends BookingClockRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async listPending(): Promise<PendingBookingClockRow[]> {
    const rows = await this.prisma.booking.findMany({
      where: { status: 'pending' },
      include: { place: { include: { bookingSettings: true } } },
    });
    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      createdAt: row.createdAt,
      replyWindowMinutes:
        row.place.bookingSettings?.replyWindowMinutes ?? DEFAULT_BOOKING_REPLY_MINUTES,
    }));
  }

  async expire(rows: readonly PendingBookingClockRow[], _now: Date): Promise<void> {
    const ids = rows.map((row) => row.id);
    await this.prisma.booking.updateMany({
      where: { id: { in: ids }, status: 'pending' },
      data: { status: 'expired' },
    });
  }
}
