import { Injectable } from '@nestjs/common';
import { LegalKind, ProfileLanguage } from '@prisma/client';

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
}
