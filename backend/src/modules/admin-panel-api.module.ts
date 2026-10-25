import { Module } from '@nestjs/common';

import { AuthAdminPanelController } from '@/authentication/auth.admin-panel.controller';
import { AuthModule } from '@/authentication/auth.module';
import { AmenityAdminPanelController } from '@/modules/amenity/amenity.admin-panel.controller';
import { AmenityModule } from '@/modules/amenity/amenity.module';
import { AreaAdminPanelController } from '@/modules/area/area.admin-panel.controller';
import { AreaModule } from '@/modules/area/area.module';
import { StaffAdminPanelController } from '@/modules/user/staff.admin-panel.controller';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule, AreaModule, AmenityModule],
  controllers: [
    AuthAdminPanelController,
    StaffAdminPanelController,
    AreaAdminPanelController,
    AmenityAdminPanelController,
  ],
})
export class AdminPanelApiModule {}
