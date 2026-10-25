import { Injectable } from '@nestjs/common';

import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import {
  CreateRatingRepoInput,
  RatingRecord,
  RatingRepository,
  RatingStatusName,
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

  override async findById(id: string): Promise<RatingRecord | null> {
    const row = await this.prisma.rating.findUnique({ where: { id } });
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

  override async listCounted(placeId: string): Promise<RatingRecord[]> {
    const rows = await this.prisma.rating.findMany({
      where: { placeId, status: 'counted' },
    });
    return rows.map(toRecord);
  }

  override async markStatus(id: string, status: RatingStatusName): Promise<RatingRecord> {
    const row = await this.prisma.rating.update({
      where: { id },
      data: { status },
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
