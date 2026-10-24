import { Module } from '@nestjs/common';

import { AuthClientAppController } from '@/authentication/auth.client-app.controller';
import { AuthModule } from '@/authentication/auth.module';
import { AccountClientAppController } from '@/modules/user/account.client-app.controller';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AuthClientAppController, AccountClientAppController],
})
export class ClientAppApiModule {}
