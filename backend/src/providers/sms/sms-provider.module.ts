import { Module } from '@nestjs/common';

import { FixedCodeSmsSender } from '@/providers/sms/fixed-code-sms.sender';
import { SmsSender } from '@/providers/sms/sms-sender';

@Module({
  providers: [{ provide: SmsSender, useClass: FixedCodeSmsSender }],
  exports: [SmsSender],
})
export class SmsProviderModule {}
