import { Injectable } from '@nestjs/common';

import { CurrentOfferRepository } from '@/modules/booking/repository/current-offer.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class CurrentOfferPrismaRepository extends CurrentOfferRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async findCurrentId(placeId: string, offerId: string, now: Date): Promise<string | null> {
    const offer = await this.prisma.offer.findFirst({
      where: {
        id: offerId,
        placeId,
        published: true,
        startsAt: { lte: now },
        endsAt: { gt: now },
      },
    });
    return offer?.id ?? null;
  }
}
