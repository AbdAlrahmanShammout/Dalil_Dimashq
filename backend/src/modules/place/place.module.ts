import { Module } from '@nestjs/common';

import { PlaceService } from '@/modules/place/place.service';
import { PlacePrismaRepository } from '@/modules/place/repository/place-prisma.repository';
import { PlaceRepository } from '@/modules/place/repository/place.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [PlaceService, { provide: PlaceRepository, useClass: PlacePrismaRepository }],
  exports: [PlaceService],
})
export class PlaceModule {}
