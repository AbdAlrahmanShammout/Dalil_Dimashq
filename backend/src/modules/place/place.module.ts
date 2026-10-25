import { Module } from '@nestjs/common';

import { DirectoryService } from '@/modules/place/directory.service';
import { PlaceGeocodeService } from '@/modules/place/place-geocode.service';
import { PlaceService } from '@/modules/place/place.service';
import { StaffPlaceService } from '@/modules/place/staff-place.service';
import { PlaceShareService } from '@/modules/place/place-share.service';
import { PlacePrismaRepository } from '@/modules/place/repository/place-prisma.repository';
import { PlaceRepository } from '@/modules/place/repository/place.repository';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';
import { AwsS3ManagerService } from '@/providers/aws-s3/aws-s3-manager.service';
import { AwsS3ProviderModule } from '@/providers/aws-s3/aws-s3-provider.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';
import { GoogleMapsProviderModule } from '@/providers/google-maps/google-maps-provider.module';

@Module({
  imports: [DatabaseProviderModule, GoogleMapsProviderModule, AwsS3ProviderModule],
  providers: [
    PlaceService,
    StaffPlaceService,
    PlaceGeocodeService,
    DirectoryService,
    PlaceShareService,
    { provide: PlaceRepository, useClass: PlacePrismaRepository },
    { provide: PhotoStorage, useExisting: AwsS3ManagerService },
  ],
  exports: [
    PlaceService,
    StaffPlaceService,
    PlaceGeocodeService,
    DirectoryService,
    PlaceShareService,
  ],
})
export class PlaceModule {}
