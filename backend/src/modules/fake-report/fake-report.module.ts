import { Module } from '@nestjs/common';

import { FakeReportService } from '@/modules/fake-report/fake-report.service';
import { FakeReportPrismaRepository } from '@/modules/fake-report/repository/fake-report-prisma.repository';
import { FakeReportRepository } from '@/modules/fake-report/repository/fake-report.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [
    FakeReportService,
    { provide: FakeReportRepository, useClass: FakeReportPrismaRepository },
  ],
  exports: [FakeReportService],
})
export class FakeReportModule {}
