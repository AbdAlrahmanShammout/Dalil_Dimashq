import { Injectable } from '@nestjs/common';

import {
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
}
