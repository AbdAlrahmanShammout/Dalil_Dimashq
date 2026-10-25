import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { TransactionContext } from '@/common/base/transaction-runner';
import { nextBan } from '@/modules/booking/booking-ban';
import {
  CreateBookingReportInput,
  DecideFakeReportInput,
  FakeReportRepository,
  OwnedFakeReport,
} from '@/modules/fake-report/repository/fake-report.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class FakeReportPrismaRepository extends FakeReportRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async findOwned(userId: string, reportId: string): Promise<OwnedFakeReport | null> {
    const row = await this.prisma.fakeReport.findFirst({ where: { id: reportId, userId } });
    return row ? { id: row.id, status: row.status } : null;
  }

  async addReply(reportId: string, body: string): Promise<{ id: string }> {
    const row = await this.prisma.fakeReportReply.create({ data: { reportId, body } });
    return { id: row.id };
  }

  override async findByBooking(bookingId: string): Promise<{ id: string } | null> {
    const row = await this.prisma.fakeReport.findUnique({ where: { bookingId } });
    return row ? { id: row.id } : null;
  }

  override async countForPlace(placeId: string, from: Date, until: Date): Promise<number> {
    return this.prisma.fakeReport.count({
      where: { placeId, createdAt: { gte: from, lt: until } },
    });
  }

  override async createBookingReport(
    input: CreateBookingReportInput,
  ): Promise<{ id: string } | null> {
    try {
      const client = this.client(input.context);
      const row = await client.fakeReport.create({
        data: {
          userId: input.userId,
          placeId: input.placeId,
          bookingId: input.bookingId,
          message: input.message,
        },
      });
      await client.adminAlert.create({
        data: {
          kind: 'fake_report',
          message: 'A fake report was opened',
          targetId: row.id,
        },
      });
      return { id: row.id };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return null;
      }
      throw error;
    }
  }

  override async decide(input: DecideFakeReportInput): Promise<'missing' | 'closed' | 'saved'> {
    return this.prisma.$transaction(async (tx) => {
      const report = await tx.fakeReport.findUnique({
        where: { id: input.id },
        include: { booking: true },
      });
      if (!report) {
        return 'missing';
      }
      if (report.status !== 'open') {
        return 'closed';
      }
      await tx.fakeReport.update({
        where: { id: report.id },
        data: {
          status: input.confirmed ? 'confirmed' : 'rejected',
          decisionNote: input.note,
          badFaith: input.badFaith,
          decidedAt: input.now,
        },
      });
      if (!report.booking) {
        return 'saved';
      }
      await tx.notification.create({
        data: {
          userId: report.booking.userId,
          kind: 'fake_report_decided',
          bookingId: report.booking.id,
        },
      });
      if (!input.confirmed) {
        return 'saved';
      }
      const existing = await tx.bookingBan.count({
        where: { userId: report.booking.userId, liftedAt: null },
      });
      const ban = nextBan(existing, input.now);
      await tx.bookingBan.create({
        data: {
          userId: report.booking.userId,
          level: ban.level,
          startsAt: input.now,
          endsAt: ban.endsAt,
        },
      });
      await tx.notification.create({
        data: {
          userId: report.booking.userId,
          kind: 'booking_ban_started',
          bookingId: report.booking.id,
        },
      });
      return 'saved';
    });
  }

  private client(context?: TransactionContext): Prisma.TransactionClient | PrismaProviderService {
    return (context as Prisma.TransactionClient | undefined) ?? this.prisma;
  }
}
