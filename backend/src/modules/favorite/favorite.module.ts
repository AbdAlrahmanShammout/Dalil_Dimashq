import { Module } from '@nestjs/common';

import { FavoriteService } from '@/modules/favorite/favorite.service';
import { FavoritePrismaRepository } from '@/modules/favorite/repository/favorite-prisma.repository';
import { FavoriteRepository } from '@/modules/favorite/repository/favorite.repository';
import { PlaceModule } from '@/modules/place/place.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, PlaceModule],
  providers: [FavoriteService, { provide: FavoriteRepository, useClass: FavoritePrismaRepository }],
  exports: [FavoriteService],
})
export class FavoriteModule {}
