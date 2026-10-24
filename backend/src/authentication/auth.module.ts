import { Module } from '@nestjs/common';

import { AuthService } from '@/authentication/auth.service';
import { UserModule } from '@/modules/user/user.module';
import { JwtProviderModule } from '@/providers/jwt/jwt-provider.module';
import { MailProviderModule } from '@/providers/mail/mail-provider.module';

@Module({
  imports: [UserModule, MailProviderModule, JwtProviderModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
