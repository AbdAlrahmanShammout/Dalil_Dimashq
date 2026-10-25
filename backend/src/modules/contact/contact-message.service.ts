import { Injectable } from '@nestjs/common';

import { AccessDeniedException } from '@/common/exceptions/access-denied.exception';
import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import {
  CONTACT_BODY_MAX_BYTES,
  CONTACT_DAILY_LIMIT,
  CONTACT_HOURLY_LIMIT,
  HOUR_MS,
  damascusDayStart,
} from '@/modules/contact/contact-limits';
import { ContactMessageRepository } from '@/modules/contact/repository/contact-message.repository';

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
    await this.assertQuota(input.visitorKey, now);
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

  private async assertQuota(visitorKey: string, now: Date): Promise<void> {
    const hourly = await this.contactMessageRepository.countSince(
      visitorKey,
      new Date(now.getTime() - HOUR_MS),
    );
    if (hourly >= CONTACT_HOURLY_LIMIT) {
      throw new InvalidStateException({ message: 'Hourly contact limit', code: 'contact_rate' });
    }
    const daily = await this.contactMessageRepository.countSince(visitorKey, damascusDayStart(now));
    if (daily >= CONTACT_DAILY_LIMIT) {
      throw new InvalidStateException({ message: 'Daily contact limit', code: 'contact_rate' });
    }
  }
}
