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

  override async listByUser(userId: string): Promise<OwnedPlaceSummary[]> {
    const rows = await this.prisma.placeOwner.findMany({
      where: { userId },
      include: { place: true },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ({
      id: row.place.id,
      nameAr: row.place.nameAr,
      nameEn: row.place.nameEn,
      type: row.place.type,
      addressAr: row.place.addressAr,
      addressEn: row.place.addressEn,
    }));
  }
}
