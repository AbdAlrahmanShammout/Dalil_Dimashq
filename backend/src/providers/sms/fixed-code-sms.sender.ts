import { Injectable } from '@nestjs/common';

import { FIXED_PHONE_CODE, SmsSender } from '@/providers/sms/sms-sender';

@Injectable()
export class FixedCodeSmsSender extends SmsSender {
  /**
   * This version does not send an SMS. A later provider replaces this class.
   */
  async sendVerificationCode(_phone: string): Promise<void> {
    return;
  }

  accepts(code: string): boolean {
    return code === FIXED_PHONE_CODE;
  }
}
