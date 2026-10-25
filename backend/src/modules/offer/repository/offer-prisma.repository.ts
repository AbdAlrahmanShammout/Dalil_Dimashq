import { Injectable } from '@nestjs/common';

import { OfferEntity } from '@/modules/offer/entity/offer.entity';
import {
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
}
