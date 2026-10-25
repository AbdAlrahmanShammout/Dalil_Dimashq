import { Module } from '@nestjs/common';

import { AuthAdminPanelController } from '@/authentication/auth.admin-panel.controller';
import { AuthModule } from '@/authentication/auth.module';
import { AmenityAdminPanelController } from '@/modules/amenity/amenity.admin-panel.controller';
import { AmenityModule } from '@/modules/amenity/amenity.module';
import { AreaAdminPanelController } from '@/modules/area/area.admin-panel.controller';
import { AreaModule } from '@/modules/area/area.module';
import { BookingBanAdminPanelController } from '@/modules/booking/booking-ban.admin-panel.controller';
import { NoShowWatchAdminPanelController } from '@/modules/booking/no-show-watch.admin-panel.controller';
import { BookingEnabledAdminPanelController } from '@/modules/booking/booking-enabled.admin-panel.controller';
import { BookingModule } from '@/modules/booking/booking.module';
import { ChangeRequestAdminPanelController } from '@/modules/change-request/change-request.admin-panel.controller';
import { FeaturedAdminPanelController } from '@/modules/place/featured.admin-panel.controller';
import { PlaceAdminPanelController } from '@/modules/place/place.admin-panel.controller';
import { PlaceModule } from '@/modules/place/place.module';
import { SiteContactAdminPanelController } from '@/modules/contact/site-contact.admin-panel.controller';
import { SuggestionAdminPanelController } from '@/modules/contact/suggestion.admin-panel.controller';
import { ContactMessageAdminPanelController } from '@/modules/contact/contact-message.admin-panel.controller';
import { EventAdminPanelController } from '@/modules/event/event.admin-panel.controller';
import { FakeReportAdminPanelController } from '@/modules/fake-report/fake-report.admin-panel.controller';
import { FakeReportModule } from '@/modules/fake-report/fake-report.module';
import { EventModule } from '@/modules/event/event.module';
import { ContactModule } from '@/modules/contact/contact.module';
import { LegalAdminPanelController } from '@/modules/legal/legal.admin-panel.controller';
import { LegalModule } from '@/modules/legal/legal.module';
import { OwnerLinkAdminPanelController } from '@/modules/owner-place/owner-link.admin-panel.controller';
import { OwnerPlaceModule } from '@/modules/owner-place/owner-place.module';
import { ProfileChangeAdminPanelController } from '@/modules/user/profile-change.admin-panel.controller';
import { PaymentAdminPanelController } from '@/modules/payment/payment.admin-panel.controller';
import { RatingAdminPanelController } from '@/modules/rating/rating.admin-panel.controller';
import { RatingModule } from '@/modules/rating/rating.module';
import { PlacePaymentAdminPanelController } from '@/modules/payment/place-payment.admin-panel.controller';
import { PaymentModule } from '@/modules/payment/payment.module';
import { SubscriptionAdminPanelController } from '@/modules/subscription/subscription.admin-panel.controller';
import { SubscriptionModule } from '@/modules/subscription/subscription.module';
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
    SubscriptionModule,
    PaymentModule,
    RatingModule,
    BookingModule,
    FakeReportModule,
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
    FeaturedAdminPanelController,
    SubscriptionAdminPanelController,
    PaymentAdminPanelController,
    RatingAdminPanelController,
    BookingEnabledAdminPanelController,
    BookingBanAdminPanelController,
    NoShowWatchAdminPanelController,
    FakeReportAdminPanelController,
    PlacePaymentAdminPanelController,
    OwnerLinkAdminPanelController,
    ChangeRequestAdminPanelController,
  ],
})
export class AdminPanelApiModule {}
