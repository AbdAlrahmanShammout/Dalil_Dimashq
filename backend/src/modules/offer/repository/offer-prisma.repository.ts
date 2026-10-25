import { Injectable } from '@nestjs/common';

import { OfferEntity } from '@/modules/offer/entity/offer.entity';
import {
  CreateOwnerOfferRepoInput,
  OfferListQuery,
  OfferPage,
  OfferRepository,
} from '@/modules/offer/repository/offer.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class OfferPrismaRepository extends OfferRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async listCurrent(query: OfferListQuery): Promise<OfferPage> {
    return this.page({ place: { status: { not: 'hidden' } } }, query);
  }

  async listCurrentForPlace(placeId: string, query: OfferListQuery): Promise<OfferPage> {
    return this.page({ placeId, place: { status: { not: 'hidden' } } }, query);
  }

  private async page(
    extra: { placeId?: string; place: { status: { not: 'hidden' } } },
    query: OfferListQuery,
  ): Promise<OfferPage> {
    const where = {
      ...extra,
      published: true,
      startsAt: { lte: query.now },
      endsAt: { gte: query.now },
    };
    const [rows, total] = await Promise.all([
      this.prisma.offer.findMany({
        where,
        orderBy: { endsAt: 'asc' },
        take: query.limit,
        skip: query.offset,
      }),
      this.prisma.offer.count({ where }),
    ]);
    return {
      items: rows.map(
        (row) =>
          new OfferEntity({
            id: row.id,
            placeId: row.placeId,
            titleAr: row.titleAr,
            titleEn: row.titleEn,
            detailsAr: row.detailsAr,
            detailsEn: row.detailsEn,
            imageKey: row.imageKey,
            endsAt: row.endsAt,
          }),
      ),
      total,
      limit: query.limit,
      offset: query.offset,
    };
  }

  override async create(input: CreateOwnerOfferRepoInput): Promise<{ id: string }> {
    const row = await this.prisma.offer.create({
      data: {
        placeId: input.placeId,
        titleAr: input.titleAr,
        titleEn: input.titleEn,
        detailsAr: input.detailsAr,
        detailsEn: input.detailsEn,
        imageKey: input.imageKey,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        published: true,
      },
    });
    return { id: row.id };
  }

  override async stop(placeId: string, offerId: string, endsAt: Date): Promise<boolean> {
    const result = await this.prisma.offer.updateMany({
      where: { id: offerId, placeId },
      data: { endsAt },
    });
    return result.count > 0;
  }

  override async deleteOwned(
    placeId: string,
    offerId: string,
  ): Promise<{ imageKey: string | null } | null> {
    const offer = await this.prisma.offer.findFirst({ where: { id: offerId, placeId } });
    if (!offer) {
      return null;
    }
    await this.prisma.offer.delete({ where: { id: offer.id } });
    return { imageKey: offer.imageKey };
  }

  override async deleteById(offerId: string): Promise<{ imageKey: string | null } | null> {
    const offer = await this.prisma.offer.findUnique({ where: { id: offerId } });
    if (!offer) {
      return null;
    }
    await this.prisma.offer.delete({ where: { id: offer.id } });
    return { imageKey: offer.imageKey };
  }
}
