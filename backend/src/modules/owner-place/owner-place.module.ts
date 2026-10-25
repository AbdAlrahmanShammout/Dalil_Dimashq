import { Module } from '@nestjs/common';

import { ChangeRequestModule } from '@/modules/change-request/change-request.module';
import { OwnerPlaceService } from '@/modules/owner-place/owner-place.service';
import { PlaceOwnerPrismaRepository } from '@/modules/owner-place/repository/place-owner-prisma.repository';
import { PlaceOwnerRepository } from '@/modules/owner-place/repository/place-owner.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, ChangeRequestModule],
  providers: [
    OwnerPlaceService,
    { provide: PlaceOwnerRepository, useClass: PlaceOwnerPrismaRepository },
  ],
  exports: [OwnerPlaceService, PlaceOwnerRepository, ChangeRequestModule],
})
export class OwnerPlaceModule {}
