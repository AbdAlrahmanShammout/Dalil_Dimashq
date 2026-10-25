import { Injectable, Optional } from '@nestjs/common';

import { AuditLogService, writeStaffAudit } from '@/modules/audit-log/audit-log.service';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { LegalRepository, LegalText } from '@/modules/legal/repository/legal.repository';

@Injectable()
export class LegalService {
  constructor(
    private readonly legalRepository: LegalRepository,
    @Optional() private readonly auditLogService?: AuditLogService,
  ) {}

  /**
   * The current terms or privacy text in the requested language.
   */
  async readCurrent(kind: 'terms' | 'privacy', language: 'ar' | 'en'): Promise<LegalText> {
    const document = await this.legalRepository.findCurrent(kind, language);
    if (!document) {
      throw new ResourceNotFoundException('LegalDocument', kind);
    }
    return document;
  }

  /**
   * Current documents this user has not accepted.
   */
  async listPending(userId: string): Promise<LegalText[]> {
    return this.legalRepository.listPending(userId);
  }

  /**
   * Records acceptance of a current document. Accepting it again changes nothing.
   */
  async acceptDocument(userId: string, documentId: string): Promise<void> {
    await this.legalRepository.accept(userId, documentId);
  }

  /**
   * Publishes a document and retires the previous current text of that kind and language.
   */
  async publish(input: {
    readonly kind: 'terms' | 'privacy';
    readonly language: 'ar' | 'en';
    readonly body: string;
    readonly actorId?: string;
  }): Promise<LegalText> {
    const body = input.body.trim();
    if (!body) {
      throw new InvalidStateException({ message: 'Nothing to change', code: 'nothing_to_change' });
    }
    const published = await this.legalRepository.publish({
      kind: input.kind,
      language: input.language,
      body,
    });
    await writeStaffAudit(this.auditLogService, {
      actorId: input.actorId,
      action: 'legal_published',
      targetType: 'legal_document',
      targetId: published.id,
      note: `${input.kind}:${input.language}`,
    });
    return published;
  }
}
