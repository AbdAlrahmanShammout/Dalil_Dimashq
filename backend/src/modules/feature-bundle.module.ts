import { Module } from '@nestjs/common';

import { AdminPanelApiModule } from '@/modules/admin-panel-api.module';
import { ClientAppApiModule } from '@/modules/client-app-api.module';
import { DashboardOwnerApiModule } from '@/modules/dashboard-owner-api.module';

@Module({
  imports: [ClientAppApiModule, DashboardOwnerApiModule, AdminPanelApiModule],
})
export class FeatureBundleModule {}
