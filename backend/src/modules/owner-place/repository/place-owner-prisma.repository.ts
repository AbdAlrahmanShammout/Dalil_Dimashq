import { Injectable } from '@nestjs/common';

import {
  ClaimTarget,
  ImmediatePlaceFields,
  OwnedPlaceSummary,
  OwnerPlaceDetail,
  PlaceNamePage,
  PlaceOwnerRepository,
  SearchPlacesByNameInput,
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

  override async searchByName(input: SearchPlacesByNameInput): Promise<PlaceNamePage> {
    const where = {
      status: { not: 'hidden' as const },
      OR: [
        { nameAr: { contains: input.name, mode: 'insensitive' as const } },
        { nameEn: { contains: input.name, mode: 'insensitive' as const } },
      ],
    };
    const [rows, total] = await Promise.all([
      this.prisma.place.findMany({
        where,
        orderBy: { nameEn: 'asc' },
        skip: input.offset,
        take: input.limit,
      }),
      this.prisma.place.count({ where }),
    ]);
    return {
      places: rows.map((row) => ({
        id: row.id,
        nameAr: row.nameAr,
        nameEn: row.nameEn,
        type: row.type,
        addressAr: row.addressAr,
        addressEn: row.addressEn,
      })),
      total,
      limit: input.limit,
      offset: input.offset,
    };
  }

  override async findClaimTarget(placeId: string): Promise<ClaimTarget | null> {
    const place = await this.prisma.place.findUnique({
      where: { id: placeId },
      select: { claimCode: true },
    });
    if (!place) {
      return null;
    }
    return { claimCode: place.claimCode };
  }

  override async linkOwner(userId: string, placeId: string): Promise<void> {
    await this.prisma.placeOwner.upsert({
      where: { placeId_userId: { placeId, userId } },
      create: { placeId, userId },
      update: {},
    });
  }

  override async isLinked(userId: string, placeId: string): Promise<boolean> {
    const row = await this.prisma.placeOwner.findUnique({
      where: { placeId_userId: { placeId, userId } },
    });
    return row !== null;
  }

  override async findDetail(placeId: string): Promise<OwnerPlaceDetail | null> {
    const place = await this.prisma.place.findUnique({ where: { id: placeId } });
    if (!place) {
      return null;
    }
    return {
      id: place.id,
      nameAr: place.nameAr,
      nameEn: place.nameEn,
      type: place.type,
      addressAr: place.addressAr,
      addressEn: place.addressEn,
    };
  }

  override async isPremium(placeId: string, now: Date): Promise<boolean> {
    const row = await this.prisma.subscription.findFirst({
      where: { placeId, endsAt: { gt: now } },
    });
    return row !== null;
  }

  override async updateImmediate(
    placeId: string,
    fields: ImmediatePlaceFields,
  ): Promise<ImmediatePlaceFields> {
    const row = await this.prisma.place.update({
      where: { id: placeId },
      data: fields,
    });
    return {
      phone: row.phone,
      website: row.website,
      email: row.email,
      facebook: row.facebook,
      instagram: row.instagram,
      descriptionAr: row.descriptionAr,
      descriptionEn: row.descriptionEn,
    };
  }
}
