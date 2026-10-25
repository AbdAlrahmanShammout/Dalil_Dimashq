import { Module } from '@nestjs/common';

import { AuthAdminPanelController } from '@/authentication/auth.admin-panel.controller';
import { AuthModule } from '@/authentication/auth.module';
import { AmenityAdminPanelController } from '@/modules/amenity/amenity.admin-panel.controller';
import { AmenityModule } from '@/modules/amenity/amenity.module';
import { AreaAdminPanelController } from '@/modules/area/area.admin-panel.controller';
import { AreaModule } from '@/modules/area/area.module';
import { ChangeRequestAdminPanelController } from '@/modules/change-request/change-request.admin-panel.controller';
import { PlaceAdminPanelController } from '@/modules/place/place.admin-panel.controller';
import { PlaceModule } from '@/modules/place/place.module';
import { SiteContactAdminPanelController } from '@/modules/contact/site-contact.admin-panel.controller';
import { SuggestionAdminPanelController } from '@/modules/contact/suggestion.admin-panel.controller';
import { ContactMessageAdminPanelController } from '@/modules/contact/contact-message.admin-panel.controller';
import { EventAdminPanelController } from '@/modules/event/event.admin-panel.controller';
import { EventModule } from '@/modules/event/event.module';
import { ContactModule } from '@/modules/contact/contact.module';
import { LegalAdminPanelController } from '@/modules/legal/legal.admin-panel.controller';
import { LegalModule } from '@/modules/legal/legal.module';
import { OwnerLinkAdminPanelController } from '@/modules/owner-place/owner-link.admin-panel.controller';
import { OwnerPlaceModule } from '@/modules/owner-place/owner-place.module';
import { ProfileChangeAdminPanelController } from '@/modules/user/profile-change.admin-panel.controller';
import { StaffAdminPanelController } from '@/modules/user/staff.admin-panel.controller';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AreaModule,
    AmenityModule,
    PlaceModule,
    OwnerPlaceModule,
    LegalModule,
    ContactModule,
    EventModule,
  ],
  controllers: [
    AuthAdminPanelController,
    StaffAdminPanelController,
    ProfileChangeAdminPanelController,
    LegalAdminPanelController,
    SiteContactAdminPanelController,
    SuggestionAdminPanelController,
    ContactMessageAdminPanelController,
    EventAdminPanelController,
    AreaAdminPanelController,
    AmenityAdminPanelController,
    PlaceAdminPanelController,
    OwnerLinkAdminPanelController,
    ChangeRequestAdminPanelController,
  ],
})
export class AdminPanelApiModule {}
