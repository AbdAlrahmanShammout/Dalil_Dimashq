import { Module } from '@nestjs/common';

import { AreaService } from '@/modules/area/area.service';
import { AreaPrismaRepository } from '@/modules/area/repository/area-prisma.repository';
import { AreaRepository } from '@/modules/area/repository/area.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [AreaService, { provide: AreaRepository, useClass: AreaPrismaRepository }],
  exports: [AreaService],
})
export class AreaModule {}
