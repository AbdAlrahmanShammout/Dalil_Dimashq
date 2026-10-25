import { Injectable } from '@nestjs/common';

import {
  OwnedPlaceSummary,
  PlaceOwnerRepository,
} from '@/modules/owner-place/repository/place-owner.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class PlaceOwnerPrismaRepository extends PlaceOwnerRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  override async listByUser(userId: string, now: Date): Promise<OwnedPlaceSummary[]> {
    const rows = await this.prisma.placeOwner.findMany({
      where: { userId },
      include: { place: true },
      orderBy: { createdAt: 'desc' },
    });
    const placeIds = rows.map((row) => row.placeId);
    const subscriptions =
      placeIds.length === 0
        ? []
        : await this.prisma.subscription.findMany({
            where: { placeId: { in: placeIds }, endsAt: { gt: now } },
            orderBy: { endsAt: 'desc' },
          });
    const pending =
      placeIds.length === 0
        ? []
        : await this.prisma.placeChangeRequest.groupBy({
            by: ['placeId'],
            where: { placeId: { in: placeIds }, status: 'pending' },
            _count: { _all: true },
          });
    return rows.map((row) => {
      const active = subscriptions.find((item) => item.placeId === row.placeId);
      const pendingRow = pending.find((item) => item.placeId === row.placeId);
      return {
        id: row.place.id,
        nameAr: row.place.nameAr,
        nameEn: row.place.nameEn,
        type: row.place.type,
        addressAr: row.place.addressAr,
        addressEn: row.place.addressEn,
        premiumActive: active !== undefined,
        premiumEndsAt: active?.endsAt ?? null,
        pendingRequestCount: pendingRow?._count._all ?? 0,
      };
    });
  }
}
