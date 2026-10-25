import { Module } from '@nestjs/common';

import { AdminAlertService } from '@/modules/admin-alert/admin-alert.service';
import { AdminAlertPrismaRepository } from '@/modules/admin-alert/repository/admin-alert-prisma.repository';
import { AdminAlertRepository } from '@/modules/admin-alert/repository/admin-alert.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [
    AdminAlertService,
    { provide: AdminAlertRepository, useClass: AdminAlertPrismaRepository },
  ],
  exports: [AdminAlertService],
})
export class AdminAlertModule {}
