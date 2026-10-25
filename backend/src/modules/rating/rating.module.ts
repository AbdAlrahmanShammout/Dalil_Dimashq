import { Module } from '@nestjs/common';

import { PlaceModule } from '@/modules/place/place.module';
import { RatingPrismaRepository } from '@/modules/rating/repository/rating-prisma.repository';
import { RatingRepository } from '@/modules/rating/repository/rating.repository';
import { RatingService } from '@/modules/rating/rating.service';
import { UserModule } from '@/modules/user/user.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, PlaceModule, UserModule],
  providers: [RatingService, { provide: RatingRepository, useClass: RatingPrismaRepository }],
  exports: [RatingService],
})
export class RatingModule {}
