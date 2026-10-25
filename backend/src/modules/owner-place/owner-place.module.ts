import { Module } from '@nestjs/common';

import { ChangeRequestModule } from '@/modules/change-request/change-request.module';
import { OwnerPlaceService } from '@/modules/owner-place/owner-place.service';
import { PlaceOwnerPrismaRepository } from '@/modules/owner-place/repository/place-owner-prisma.repository';
import { PlaceOwnerRepository } from '@/modules/owner-place/repository/place-owner.repository';
import { AmenityModule } from '@/modules/amenity/amenity.module';
import { PlaceHourModule } from '@/modules/place-hour/place-hour.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, ChangeRequestModule, PlaceHourModule, AmenityModule],
  providers: [
    OwnerPlaceService,
    { provide: PlaceOwnerRepository, useClass: PlaceOwnerPrismaRepository },
  ],
  exports: [
    OwnerPlaceService,
    PlaceOwnerRepository,
    ChangeRequestModule,
    PlaceHourModule,
    AmenityModule,
  ],
})
export class OwnerPlaceModule {}
