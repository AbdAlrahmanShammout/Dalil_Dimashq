import { Injectable } from '@nestjs/common';
import { PlaceType, Prisma } from '@prisma/client';

import {
  ApplyChangeDecisionInput,
  CreatePlaceChangeRepoInput,
  PlaceChangePending,
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
    const row = await this.prisma.$transaction(async (tx) => {
      const created = await tx.placeChangeRequest.create({
        data: {
          placeId: input.placeId,
          userId: input.userId,
          kind: input.kind,
          reason: input.reason,
          payload:
            input.payload === null ? Prisma.DbNull : (input.payload as Prisma.InputJsonValue),
        },
      });
      await tx.adminAlert.create({
        data: {
          kind: 'change_request',
          message: 'A place change request was opened',
          targetId: created.id,
        },
      });
      return created;
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

  override async countPending(): Promise<number> {
    return this.prisma.placeChangeRequest.count({ where: { status: 'pending' } });
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

  override async findById(id: string): Promise<PlaceChangePending | null> {
    const row = await this.prisma.placeChangeRequest.findUnique({ where: { id } });
    if (!row) {
      return null;
    }
    return { ...this.toRecord(row), payload: readPayload(row.payload) };
  }

  override async applyDecision(input: ApplyChangeDecisionInput): Promise<PlaceChangeRecord | null> {
    return this.prisma.$transaction(async (tx) => {
      const claimed = await tx.placeChangeRequest.updateMany({
        where: { id: input.id, status: 'pending' },
        data: {
          status: input.approved ? 'approved' : 'rejected',
          decisionNote: input.note,
          decidedAt: new Date(),
        },
      });
      if (claimed.count === 0) {
        return null;
      }
      if (input.approved && input.effect) {
        await applyEffect(tx, input.effect);
      }
      const row = await tx.placeChangeRequest.findUniqueOrThrow({ where: { id: input.id } });
      return this.toRecord(row);
    });
  }

  private toRecord(row: {
    id: string;
    placeId: string;
    userId: string;
    kind: PlaceChangeRecord['kind'];
    status: PlaceChangeRecord['status'];
    reason: string | null;
    decisionNote: string | null;
  }): PlaceChangeRecord {
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

function readPayload(value: Prisma.JsonValue | null): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value;
}

async function applyEffect(
  tx: Prisma.TransactionClient,
  effect: NonNullable<ApplyChangeDecisionInput['effect']>,
): Promise<void> {
  if (effect.kind === 'claim') {
    await tx.placeOwner.upsert({
      where: { placeId_userId: { placeId: effect.placeId, userId: effect.userId } },
      create: { placeId: effect.placeId, userId: effect.userId },
      update: {},
    });
  }
  if (effect.kind === 'unlink') {
    await tx.placeOwner.deleteMany({ where: { placeId: effect.placeId, userId: effect.userId } });
  }
  if (effect.kind === 'remove') {
    await tx.place.update({ where: { id: effect.placeId }, data: { status: 'hidden' } });
  }
  if (effect.kind === 'edit') {
    if (Object.keys(effect.fields).length > 0) {
      await tx.place.update({
        where: { id: effect.placeId },
        data: {
          ...effect.fields,
          type: effect.fields.type as PlaceType | undefined,
        },
      });
    }
    if (effect.hours) {
      await tx.placeHour.deleteMany({ where: { placeId: effect.placeId, season: 'regular' } });
      if (effect.hours.length > 0) {
        await tx.placeHour.createMany({
          data: effect.hours.map((period) => ({
            placeId: effect.placeId,
            dayOfWeek: period.dayOfWeek,
            opensAt: period.opensAt,
            closesAt: period.closesAt,
            season: 'regular' as const,
          })),
        });
      }
    }
  }
}
