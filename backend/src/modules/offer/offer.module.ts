import { Module } from '@nestjs/common';

import { OfferService } from '@/modules/offer/offer.service';
import { OfferPrismaRepository } from '@/modules/offer/repository/offer-prisma.repository';
import { OfferRepository } from '@/modules/offer/repository/offer.repository';
import { PlaceModule } from '@/modules/place/place.module';
import { PhotoStorage } from '@/modules/place-photo/photo-storage';
import { AwsS3ManagerService } from '@/providers/aws-s3/aws-s3-manager.service';
import { AwsS3ProviderModule } from '@/providers/aws-s3/aws-s3-provider.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, PlaceModule, AwsS3ProviderModule],
  providers: [
    OfferService,
    { provide: OfferRepository, useClass: OfferPrismaRepository },
    { provide: PhotoStorage, useExisting: AwsS3ManagerService },
  ],
  exports: [OfferService],
})
export class OfferModule {}
