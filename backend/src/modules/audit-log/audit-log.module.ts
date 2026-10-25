import { Module } from '@nestjs/common';

import { AuditLogService } from '@/modules/audit-log/audit-log.service';
import { AuditLogPrismaRepository } from '@/modules/audit-log/repository/audit-log-prisma.repository';
import { AuditLogRepository } from '@/modules/audit-log/repository/audit-log.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [AuditLogService, { provide: AuditLogRepository, useClass: AuditLogPrismaRepository }],
  exports: [AuditLogService],
})
export class AuditLogModule {}
