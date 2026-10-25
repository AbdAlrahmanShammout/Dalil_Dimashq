import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { TransactionContext } from '@/common/base/transaction-runner';

import {
  CreateBookingReportInput,
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
      const row = await this.client(input.context).fakeReport.create({
        data: {
          userId: input.userId,
          placeId: input.placeId,
          bookingId: input.bookingId,
          message: input.message,
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

  private client(context?: TransactionContext): Prisma.TransactionClient | PrismaProviderService {
    return (context as Prisma.TransactionClient | undefined) ?? this.prisma;
  }
}
