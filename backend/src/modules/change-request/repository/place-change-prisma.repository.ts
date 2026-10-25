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
}
