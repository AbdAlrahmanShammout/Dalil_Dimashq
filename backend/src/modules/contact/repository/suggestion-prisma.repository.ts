import { Injectable } from '@nestjs/common';

import {
  CreateSuggestionInput,
  SuggestionPage,
  SuggestionRepository,
  SuggestionStatusName,
} from '@/modules/contact/repository/suggestion.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class SuggestionPrismaRepository extends SuggestionRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async countSince(visitorKey: string, since: Date): Promise<number> {
    return this.prisma.suggestion.count({
      where: { visitorKey, createdAt: { gte: since } },
    });
  }

  async create(input: CreateSuggestionInput): Promise<{ id: string }> {
    const row = await this.prisma.suggestion.create({
      data: {
        name: input.name,
        contact: input.contact,
        kind: input.kind,
        message: input.message,
        placeId: input.placeId,
        visitorKey: input.visitorKey,
        createdAt: input.now,
      },
    });
    return { id: row.id };
  }

  override async list(limit: number, offset: number): Promise<SuggestionPage> {
    const [rows, total] = await Promise.all([
      this.prisma.suggestion.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.suggestion.count(),
    ]);
    return {
      total,
      items: rows.map((row) => ({
        id: row.id,
        name: row.name,
        contact: row.contact,
        kind: row.kind,
        message: row.message,
        placeId: row.placeId,
        status: row.status,
        createdAt: row.createdAt,
      })),
    };
  }

  override async setStatus(id: string, status: SuggestionStatusName): Promise<boolean> {
    const result = await this.prisma.suggestion.updateMany({ where: { id }, data: { status } });
    return result.count > 0;
  }

  override async deleteById(id: string): Promise<boolean> {
    const result = await this.prisma.suggestion.deleteMany({ where: { id } });
    return result.count > 0;
  }
}
