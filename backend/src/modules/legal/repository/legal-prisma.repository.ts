import { Injectable } from '@nestjs/common';
import { LegalKind, ProfileLanguage } from '@prisma/client';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { LegalRepository, LegalText } from '@/modules/legal/repository/legal.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class LegalPrismaRepository extends LegalRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async findCurrent(kind: 'terms' | 'privacy', language: 'ar' | 'en'): Promise<LegalText | null> {
    const row = await this.prisma.legalDocument.findFirst({
      where: {
        kind: kind as LegalKind,
        language: language as ProfileLanguage,
        isCurrent: true,
      },
      orderBy: { publishedAt: 'desc' },
    });
    if (!row) {
      return null;
    }
    return { id: row.id, kind, language, body: row.body };
  }

  async listPending(userId: string): Promise<LegalText[]> {
    const rows = await this.prisma.legalDocument.findMany({
      where: { isCurrent: true, acceptances: { none: { userId } } },
      orderBy: { publishedAt: 'desc' },
    });
    return rows.map((row) => ({
      id: row.id,
      kind: row.kind,
      language: row.language,
      body: row.body,
    }));
  }

  async accept(userId: string, documentId: string): Promise<void> {
    const document = await this.prisma.legalDocument.findFirst({
      where: { id: documentId, isCurrent: true },
    });
    if (!document) {
      throw new ResourceNotFoundException('LegalDocument', documentId);
    }
    await this.prisma.legalAcceptance.upsert({
      where: { userId_documentId: { userId, documentId } },
      update: {},
      create: { userId, documentId },
    });
  }
}
