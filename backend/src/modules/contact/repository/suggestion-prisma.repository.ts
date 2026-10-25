import { Injectable } from '@nestjs/common';

import {
  CreateSuggestionInput,
  SuggestionRepository,
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
}
