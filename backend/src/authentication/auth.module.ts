import { Module } from '@nestjs/common';

import { AuthService } from '@/authentication/auth.service';
import { ForgetPasswordService } from '@/authentication/forget-password.service';
import { UserModule } from '@/modules/user/user.module';
import { JwtProviderModule } from '@/providers/jwt/jwt-provider.module';
import { MailProviderModule } from '@/providers/mail/mail-provider.module';
import { GoogleAuthProviderModule } from '@/providers/google-auth/google-auth-provider.module';

@Module({
  imports: [UserModule, MailProviderModule, JwtProviderModule, GoogleAuthProviderModule],
  providers: [AuthService, ForgetPasswordService],
  exports: [AuthService, ForgetPasswordService],
})
export class AuthModule {}
