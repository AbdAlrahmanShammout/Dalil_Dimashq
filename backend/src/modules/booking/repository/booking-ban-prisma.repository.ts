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
}
