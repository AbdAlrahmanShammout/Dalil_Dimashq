import { Injectable } from '@nestjs/common';

import {
  RecentPlaceRepository,
  RecentPlaceSummary,
} from '@/modules/recent-view/repository/recent-place.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class RecentPlacePrismaRepository extends RecentPlaceRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async record(userId: string, placeId: string, viewedAt: Date): Promise<void> {
    await this.prisma.recentPlace.upsert({
      where: { userId_placeId: { userId, placeId } },
      update: { viewedAt },
      create: { userId, placeId, viewedAt },
    });
  }

  async list(userId: string, limit: number): Promise<RecentPlaceSummary[]> {
    const rows = await this.prisma.recentPlace.findMany({
      where: { userId, place: { status: { not: 'hidden' } } },
      include: { place: true },
      orderBy: { viewedAt: 'desc' },
      take: limit,
    });
    return rows.map((row) => ({
      id: row.place.id,
      nameAr: row.place.nameAr,
      nameEn: row.place.nameEn,
      type: row.place.type,
      viewedAt: row.viewedAt,
    }));
  }
}
