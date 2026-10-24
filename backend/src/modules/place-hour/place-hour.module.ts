import { Module } from '@nestjs/common';

import { PlaceModule } from '@/modules/place/place.module';
import { PlaceHourService } from '@/modules/place-hour/place-hour.service';
import { PlaceHourPrismaRepository } from '@/modules/place-hour/repository/place-hour-prisma.repository';
import { PlaceHourRepository } from '@/modules/place-hour/repository/place-hour.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, PlaceModule],
  providers: [
    PlaceHourService,
    { provide: PlaceHourRepository, useClass: PlaceHourPrismaRepository },
  ],
  exports: [PlaceHourService],
})
export class PlaceHourModule {}
