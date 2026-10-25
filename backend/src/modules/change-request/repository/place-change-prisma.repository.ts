import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  CreatePlaceChangeRepoInput,
  PlaceChangeRecord,
  PlaceChangeRepository,
} from '@/modules/change-request/repository/place-change.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class PlaceChangePrismaRepository extends PlaceChangeRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  override async create(input: CreatePlaceChangeRepoInput): Promise<PlaceChangeRecord> {
    const row = await this.prisma.placeChangeRequest.create({
      data: {
        placeId: input.placeId,
        userId: input.userId,
        kind: input.kind,
        reason: input.reason,
        payload: input.payload === null ? Prisma.DbNull : (input.payload as Prisma.InputJsonValue),
      },
    });
    return {
      id: row.id,
      placeId: row.placeId,
      userId: row.userId,
      kind: row.kind,
      status: row.status,
      reason: row.reason,
      decisionNote: row.decisionNote,
    };
  }

  override async listByPlace(placeId: string): Promise<PlaceChangeRecord[]> {
    const rows = await this.prisma.placeChangeRequest.findMany({
      where: { placeId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ({
      id: row.id,
      placeId: row.placeId,
      userId: row.userId,
      kind: row.kind,
      status: row.status,
      reason: row.reason,
      decisionNote: row.decisionNote,
    }));
  }
}
