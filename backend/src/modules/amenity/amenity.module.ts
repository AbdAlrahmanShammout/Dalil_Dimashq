import { Module } from '@nestjs/common';

import { AmenityService } from '@/modules/amenity/amenity.service';
import { AmenityPrismaRepository } from '@/modules/amenity/repository/amenity-prisma.repository';
import { AmenityRepository } from '@/modules/amenity/repository/amenity.repository';
import { PlaceModule } from '@/modules/place/place.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, PlaceModule],
  providers: [AmenityService, { provide: AmenityRepository, useClass: AmenityPrismaRepository }],
  exports: [AmenityService],
})
export class AmenityModule {}
