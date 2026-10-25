import { Injectable } from '@nestjs/common';

import {
  ActiveBan,
  BookingBanRepository,
} from '@/modules/booking/repository/booking-ban.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class BookingBanPrismaRepository extends BookingBanRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async findActive(userId: string, now: Date): Promise<ActiveBan | null> {
    const row = await this.prisma.bookingBan.findFirst({
      where: {
        userId,
        liftedAt: null,
        startsAt: { lte: now },
        OR: [{ endsAt: null }, { endsAt: { gt: now } }],
      },
      orderBy: { startsAt: 'desc' },
    });
    if (!row) {
      return null;
    }
    return { level: row.level, endsAt: row.endsAt };
  }

  override async lift(
    id: string,
    note: string,
    liftedAt: Date,
  ): Promise<'missing' | 'lifted' | 'saved'> {
    const existing = await this.prisma.bookingBan.findUnique({ where: { id } });
    if (!existing) {
      return 'missing';
    }
    if (existing.liftedAt) {
      return 'lifted';
    }
    await this.prisma.$transaction([
      this.prisma.bookingBan.update({
        where: { id },
        data: { liftedAt, liftedNote: note, endsAt: liftedAt },
      }),
      this.prisma.notification.create({
        data: { userId: existing.userId, kind: 'booking_ban_lifted' },
      }),
    ]);
    return 'saved';
  }
}
