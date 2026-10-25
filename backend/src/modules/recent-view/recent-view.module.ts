import { Module } from '@nestjs/common';

import { PlaceModule } from '@/modules/place/place.module';
import { RecentPlacePrismaRepository } from '@/modules/recent-view/repository/recent-place-prisma.repository';
import { RecentPlaceRepository } from '@/modules/recent-view/repository/recent-place.repository';
import { RecentPlaceService } from '@/modules/recent-view/recent-place.service';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, PlaceModule],
  providers: [
    RecentPlaceService,
    { provide: RecentPlaceRepository, useClass: RecentPlacePrismaRepository },
  ],
  exports: [RecentPlaceService],
})
export class RecentViewModule {}
