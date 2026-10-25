import { Module } from '@nestjs/common';

import { PlaceChangePrismaRepository } from '@/modules/change-request/repository/place-change-prisma.repository';
import { PlaceChangeRepository } from '@/modules/change-request/repository/place-change.repository';
import { PlaceChangeService } from '@/modules/change-request/place-change.service';
import { AuditLogModule } from '@/modules/audit-log/audit-log.module';
import { PlaceModule } from '@/modules/place/place.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, PlaceModule, AuditLogModule],
  providers: [
    PlaceChangeService,
    { provide: PlaceChangeRepository, useClass: PlaceChangePrismaRepository },
  ],
  exports: [PlaceChangeService],
})
export class ChangeRequestModule {}
