import { Injectable } from '@nestjs/common';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { CONTACT_BODY_MAX_BYTES, assertMessageQuota } from '@/modules/contact/contact-limits';
import {
  SUGGESTION_KINDS,
  SUGGESTION_STATUSES,
  SuggestionKind,
  SuggestionPage,
  SuggestionRepository,
  SuggestionStatusName,
} from '@/modules/contact/repository/suggestion.repository';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/modules/place/enum/general.enum';

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

  /**
   * The staff queue, newest first.
   */
  async list(input: { limit?: number; offset?: number }): Promise<
    SuggestionPage & {
      limit: number;
      offset: number;
    }
  > {
    const limit = input.limit ?? DEFAULT_PAGE_LIMIT;
    const offset = input.offset ?? DEFAULT_PAGE_OFFSET;
    const page = await this.suggestionRepository.list(limit, offset);
    return { ...page, limit, offset };
  }

  /**
   * Moves a suggestion to open, done, or dismissed.
   */
  async setStatus(id: string, status: string): Promise<void> {
    if (!SUGGESTION_STATUSES.includes(status as SuggestionStatusName)) {
      throw new InvalidStateException({
        message: 'Unknown suggestion status',
        code: 'kind_invalid',
      });
    }
    const updated = await this.suggestionRepository.setStatus(id, status as SuggestionStatusName);
    if (!updated) {
      throw new ResourceNotFoundException('Suggestion', id);
    }
  }

  /**
   * Removes one suggestion.
   */
  async remove(id: string): Promise<void> {
    const removed = await this.suggestionRepository.deleteById(id);
    if (!removed) {
      throw new ResourceNotFoundException('Suggestion', id);
    }
  }
}
