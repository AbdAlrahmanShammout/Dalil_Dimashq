import { Module } from '@nestjs/common';

import { AuthDashboardOwnerController } from '@/authentication/auth.dashboard-owner.controller';
import { AuthModule } from '@/authentication/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AuthDashboardOwnerController],
})
export class DashboardOwnerApiModule {}
