import { Module } from '@nestjs/common';

import { AuthDashboardOwnerController } from '@/authentication/auth.dashboard-owner.controller';
import { AuthModule } from '@/authentication/auth.module';
import { DeviceDashboardOwnerController } from '@/modules/device/device.dashboard-owner.controller';
import { DeviceModule } from '@/modules/device/device.module';
import { AccountDashboardOwnerController } from '@/modules/user/account.dashboard-owner.controller';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule, DeviceModule],
  controllers: [
    AuthDashboardOwnerController,
    AccountDashboardOwnerController,
    DeviceDashboardOwnerController,
  ],
})
export class DashboardOwnerApiModule {}
