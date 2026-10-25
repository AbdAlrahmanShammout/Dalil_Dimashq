import { Injectable } from '@nestjs/common';

import {
  FavoritePlace,
  FavoriteRepository,
} from '@/modules/favorite/repository/favorite.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class FavoritePrismaRepository extends FavoriteRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async add(userId: string, placeId: string): Promise<void> {
    await this.prisma.favorite.upsert({
      where: { userId_placeId: { userId, placeId } },
      update: {},
      create: { userId, placeId },
    });
  }

  async remove(userId: string, placeId: string): Promise<boolean> {
    const result = await this.prisma.favorite.deleteMany({ where: { userId, placeId } });
    return result.count > 0;
  }

  async list(userId: string): Promise<FavoritePlace[]> {
    const rows = await this.prisma.favorite.findMany({
      where: { userId, place: { status: { not: 'hidden' } } },
      include: { place: true },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ({
      id: row.place.id,
      nameAr: row.place.nameAr,
      nameEn: row.place.nameEn,
      type: row.place.type,
    }));
  }
}
