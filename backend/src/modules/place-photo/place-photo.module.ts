import { Module } from '@nestjs/common';

import { PlaceModule } from '@/modules/place/place.module';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';
import { PlacePhotoService } from '@/modules/place-photo/place-photo.service';
import { PlacePhotoPrismaRepository } from '@/modules/place-photo/repository/place-photo-prisma.repository';
import { PlacePhotoRepository } from '@/modules/place-photo/repository/place-photo.repository';
import { AwsS3ManagerService } from '@/providers/aws-s3/aws-s3-manager.service';
import { AwsS3ProviderModule } from '@/providers/aws-s3/aws-s3-provider.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, PlaceModule, AwsS3ProviderModule],
  providers: [
    PlacePhotoService,
    { provide: PlacePhotoRepository, useClass: PlacePhotoPrismaRepository },
    { provide: PhotoStorage, useExisting: AwsS3ManagerService },
  ],
  exports: [PlacePhotoService],
})
export class PlacePhotoModule {}
