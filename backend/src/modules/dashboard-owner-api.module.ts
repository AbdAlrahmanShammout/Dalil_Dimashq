import { Module } from '@nestjs/common';

import { AuthDashboardOwnerController } from '@/authentication/auth.dashboard-owner.controller';
import { AuthModule } from '@/authentication/auth.module';
import { AccountDashboardOwnerController } from '@/modules/user/account.dashboard-owner.controller';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AuthDashboardOwnerController, AccountDashboardOwnerController],
})
export class DashboardOwnerApiModule {}
