import { Injectable } from '@nestjs/common';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { CONTACT_BODY_MAX_BYTES, assertMessageQuota } from '@/modules/contact/contact-limits';
import {
  SUGGESTION_KINDS,
  SuggestionKind,
  SuggestionRepository,
} from '@/modules/contact/repository/suggestion.repository';

export interface SubmitSuggestionInput {
  readonly name: string;
  readonly contact: string;
  readonly kind: string;
  readonly message: string;
  readonly placeId?: string;
  readonly visitorKey: string;
  readonly bodyBytes: number;
  readonly now?: Date;
}

@Injectable()
export class SuggestionService {
  constructor(private readonly suggestionRepository: SuggestionRepository) {}

  /**
   * Stores a public place suggestion. The quota matches the contact form.
   */
  async submit(input: SubmitSuggestionInput): Promise<{ id: string }> {
    const now = input.now ?? new Date();
    if (input.bodyBytes > CONTACT_BODY_MAX_BYTES) {
      throw new InvalidStateException({ message: 'Body is too large', code: 'body_too_large' });
    }
    if (!SUGGESTION_KINDS.includes(input.kind as SuggestionKind)) {
      throw new InvalidStateException({ message: 'Unknown suggestion kind', code: 'kind_invalid' });
    }
    await assertMessageQuota(
      (visitorKey, since) => this.suggestionRepository.countSince(visitorKey, since),
      input.visitorKey,
      now,
      'suggestion_rate',
    );
    return this.suggestionRepository.create({
      name: input.name,
      contact: input.contact,
      kind: input.kind as SuggestionKind,
      message: input.message,
      placeId: input.placeId ?? null,
      visitorKey: input.visitorKey,
      now,
    });
  }
}
