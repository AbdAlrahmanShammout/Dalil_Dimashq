import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { LegalRepository, LegalText } from '@/modules/legal/repository/legal.repository';

@Injectable()
export class LegalService {
  constructor(private readonly legalRepository: LegalRepository) {}

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
}
