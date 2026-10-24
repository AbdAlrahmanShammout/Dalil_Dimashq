import { Module } from '@nestjs/common';

import { MailManagerService } from '@/providers/mail/mail-manager.service';

@Module({
  providers: [MailManagerService],
  exports: [MailManagerService],
})
export class MailProviderModule {}
