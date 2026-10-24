import { Module } from '@nestjs/common';

import { AuthClientAppController } from '@/authentication/auth.client-app.controller';
import { AuthModule } from '@/authentication/auth.module';
import { AreaClientAppController } from '@/modules/area/area.client-app.controller';
import { AreaModule } from '@/modules/area/area.module';
import { AccountClientAppController } from '@/modules/user/account.client-app.controller';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule, AreaModule],
  controllers: [AuthClientAppController, AccountClientAppController, AreaClientAppController],
})
export class ClientAppApiModule {}
