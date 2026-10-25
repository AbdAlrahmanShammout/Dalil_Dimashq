import { Injectable } from '@nestjs/common';

import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import {
  CreateRatingRepoInput,
  RatingRecord,
  RatingRepository,
} from '@/modules/rating/repository/rating.repository';

@Injectable()
export class RatingPrismaRepository extends RatingRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  override async findByVisitor(userId: string, placeId: string): Promise<RatingRecord | null> {
    const row = await this.prisma.rating.findUnique({
      where: { userId_placeId: { userId, placeId } },
    });
    return row ? toRecord(row) : null;
  }

  override async create(input: CreateRatingRepoInput): Promise<RatingRecord> {
    const row = await this.prisma.rating.create({
      data: {
        userId: input.userId,
        placeId: input.placeId,
        stars: input.stars,
        status: 'held',
      },
    });
    return toRecord(row);
  }
}

function toRecord(row: {
  id: string;
  userId: string;
  placeId: string;
  stars: number;
  status: 'held' | 'counted' | 'rejected';
}): RatingRecord {
  return {
    id: row.id,
    userId: row.userId,
    placeId: row.placeId,
    stars: row.stars,
    status: row.status,
  };
}
