import { Module } from '@nestjs/common';

import { PlaceGeocodeService } from '@/modules/place/place-geocode.service';
import { PlaceService } from '@/modules/place/place.service';
import { PlacePrismaRepository } from '@/modules/place/repository/place-prisma.repository';
import { PlaceRepository } from '@/modules/place/repository/place.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';
import { GoogleMapsProviderModule } from '@/providers/google-maps/google-maps-provider.module';

@Module({
  imports: [DatabaseProviderModule, GoogleMapsProviderModule],
  providers: [
    PlaceService,
    PlaceGeocodeService,
    { provide: PlaceRepository, useClass: PlacePrismaRepository },
  ],
  exports: [PlaceService, PlaceGeocodeService],
})
export class PlaceModule {}
