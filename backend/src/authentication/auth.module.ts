import { Module } from '@nestjs/common';

import { AuthService } from '@/authentication/auth.service';
import { UserModule } from '@/modules/user/user.module';
import { MailProviderModule } from '@/providers/mail/mail-provider.module';

@Module({
  imports: [UserModule, MailProviderModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
