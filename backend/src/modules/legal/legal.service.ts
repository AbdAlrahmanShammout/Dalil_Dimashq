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
}
