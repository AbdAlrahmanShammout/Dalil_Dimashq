import { Module } from '@nestjs/common';

import { LegalService } from '@/modules/legal/legal.service';
import { LegalPrismaRepository } from '@/modules/legal/repository/legal-prisma.repository';
import { LegalRepository } from '@/modules/legal/repository/legal.repository';
import { AuditLogModule } from '@/modules/audit-log/audit-log.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, AuditLogModule],
  providers: [LegalService, { provide: LegalRepository, useClass: LegalPrismaRepository }],
  exports: [LegalService],
})
export class LegalModule {}
