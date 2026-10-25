import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  SubscriptionRecord,
  SubscriptionRepository,
} from '@/modules/subscription/repository/subscription.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class SubscriptionPrismaRepository extends SubscriptionRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  override async create(input: {
    placeId: string;
    endsAt: Date;
  }): Promise<SubscriptionRecord | null> {
    try {
      const row = await this.prisma.subscription.create({
        data: { placeId: input.placeId, endsAt: input.endsAt },
      });
      return { id: row.id, placeId: row.placeId, endsAt: row.endsAt };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        return null;
      }
      throw error;
    }
  }

  override async updateEndsAt(id: string, endsAt: Date): Promise<SubscriptionRecord | null> {
    const result = await this.prisma.subscription.updateMany({ where: { id }, data: { endsAt } });
    if (result.count === 0) {
      return null;
    }
    const row = await this.prisma.subscription.findUniqueOrThrow({ where: { id } });
    return { id: row.id, placeId: row.placeId, endsAt: row.endsAt };
  }
}
