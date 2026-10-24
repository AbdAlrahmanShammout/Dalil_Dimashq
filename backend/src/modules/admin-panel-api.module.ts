import { Module } from '@nestjs/common';

import { AuthAdminPanelController } from '@/authentication/auth.admin-panel.controller';
import { AuthModule } from '@/authentication/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AuthAdminPanelController],
})
export class AdminPanelApiModule {}
