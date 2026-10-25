import { Injectable } from '@nestjs/common';

import { AccessDeniedException } from '@/common/exceptions/access-denied.exception';
import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { CONTACT_BODY_MAX_BYTES, assertMessageQuota } from '@/modules/contact/contact-limits';
import {
  ContactMessagePage,
  ContactMessageRepository,
} from '@/modules/contact/repository/contact-message.repository';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/modules/place/enum/general.enum';

export interface SubmitContactInput {
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
  readonly type: string;
  readonly message: string;
  readonly website?: string;
  readonly visitorKey: string;
  readonly bodyBytes: number;
  readonly now?: Date;
}

@Injectable()
export class ContactMessageService {
  constructor(private readonly contactMessageRepository: ContactMessageRepository) {}

  /**
   * Stores a contact message for the panel. A filled honeypot or a full quota is refused.
   */
  async submit(input: SubmitContactInput): Promise<{ id: string }> {
    const now = input.now ?? new Date();
    if (input.website) {
      throw new AccessDeniedException({ message: 'Honeypot was filled', code: 'honeypot' });
    }
    if (input.bodyBytes > CONTACT_BODY_MAX_BYTES) {
      throw new InvalidStateException({ message: 'Body is too large', code: 'body_too_large' });
    }
    if (!input.email && !input.phone) {
      throw new InvalidStateException({
        message: 'Email or phone is required',
        code: 'contact_required',
      });
    }
    await assertMessageQuota(
      (visitorKey, since) => this.contactMessageRepository.countSince(visitorKey, since),
      input.visitorKey,
      now,
      'contact_rate',
    );
    return this.contactMessageRepository.create({
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      type: input.type,
      message: input.message,
      visitorKey: input.visitorKey,
      now,
    });
  }

  /**
   * Contact-form rows for the editor queue, newest first.
   */
  async list(input: {
    limit?: number;
    offset?: number;
  }): Promise<ContactMessagePage & { limit: number; offset: number }> {
    const limit = input.limit ?? DEFAULT_PAGE_LIMIT;
    const offset = input.offset ?? DEFAULT_PAGE_OFFSET;
    const page = await this.contactMessageRepository.list(limit, offset);
    return { ...page, limit, offset };
  }
}
