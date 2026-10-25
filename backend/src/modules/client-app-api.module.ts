import { Module } from '@nestjs/common';

import { AuthClientAppController } from '@/authentication/auth.client-app.controller';
import { AuthModule } from '@/authentication/auth.module';
import { AreaClientAppController } from '@/modules/area/area.client-app.controller';
import { AreaModule } from '@/modules/area/area.module';
import { AmenityClientAppController } from '@/modules/amenity/amenity.client-app.controller';
import { AmenityModule } from '@/modules/amenity/amenity.module';
import { EventClientAppController } from '@/modules/event/event.client-app.controller';
import { EventModule } from '@/modules/event/event.module';
import { BookingAvailabilityClientAppController } from '@/modules/booking/booking-availability.client-app.controller';
import { BookingClientAppController } from '@/modules/booking/booking.client-app.controller';
import { BookingModule } from '@/modules/booking/booking.module';
import { FakeReportClientAppController } from '@/modules/fake-report/fake-report.client-app.controller';
import { FakeReportModule } from '@/modules/fake-report/fake-report.module';
import { DeviceClientAppController } from '@/modules/device/device.client-app.controller';
import { DeviceModule } from '@/modules/device/device.module';
import { FavoriteClientAppController } from '@/modules/favorite/favorite.client-app.controller';
import { FavoriteModule } from '@/modules/favorite/favorite.module';
import { RecentPlaceClientAppController } from '@/modules/recent-view/recent-place.client-app.controller';
import { RecentViewModule } from '@/modules/recent-view/recent-view.module';
import { NotificationClientAppController } from '@/modules/notification/notification.client-app.controller';
import { NotificationModule } from '@/modules/notification/notification.module';
import { ContactClientAppController } from '@/modules/contact/contact.client-app.controller';
import { SuggestionClientAppController } from '@/modules/contact/suggestion.client-app.controller';
import { SiteContactClientAppController } from '@/modules/contact/site-contact.client-app.controller';
import { ContactModule } from '@/modules/contact/contact.module';
import { LegalClientAppController } from '@/modules/legal/legal.client-app.controller';
import { LegalModule } from '@/modules/legal/legal.module';
import { OfferClientAppController } from '@/modules/offer/offer.client-app.controller';
import { OfferPlaceClientAppController } from '@/modules/offer/offer-place.client-app.controller';
import { OfferModule } from '@/modules/offer/offer.module';
import { PlacePhotoClientAppController } from '@/modules/place-photo/place-photo.client-app.controller';
import { PlacePhotoModule } from '@/modules/place-photo/place-photo.module';
import { PlaceHourClientAppController } from '@/modules/place-hour/place-hour.client-app.controller';
import { PlaceHourModule } from '@/modules/place-hour/place-hour.module';
import { DirectoryClientAppController } from '@/modules/place/directory.client-app.controller';
import { PlaceShareClientAppController } from '@/modules/place/place-share.client-app.controller';
import { PlaceClientAppController } from '@/modules/place/place.client-app.controller';
import { PlaceModule } from '@/modules/place/place.module';
import { SearchModule } from '@/modules/search/search.module';
import { AccountClientAppController } from '@/modules/user/account.client-app.controller';
import { ProfileClientAppController } from '@/modules/user/profile.client-app.controller';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AreaModule,
    PlaceModule,
    SearchModule,
    PlaceHourModule,
    AmenityModule,
    PlacePhotoModule,
    OfferModule,
    EventModule,
    LegalModule,
    ContactModule,
    BookingModule,
    FakeReportModule,
    NotificationModule,
    DeviceModule,
    FavoriteModule,
    RecentViewModule,
  ],
  controllers: [
    AuthClientAppController,
    AccountClientAppController,
    ProfileClientAppController,
    AreaClientAppController,
    PlaceClientAppController,
    PlaceShareClientAppController,
    DirectoryClientAppController,
    PlaceHourClientAppController,
    AmenityClientAppController,
    PlacePhotoClientAppController,
    OfferClientAppController,
    OfferPlaceClientAppController,
    EventClientAppController,
    LegalClientAppController,
    SiteContactClientAppController,
    ContactClientAppController,
    SuggestionClientAppController,
    BookingAvailabilityClientAppController,
    BookingClientAppController,
    FakeReportClientAppController,
    NotificationClientAppController,
    DeviceClientAppController,
    FavoriteClientAppController,
    RecentPlaceClientAppController,
  ],
})
export class ClientAppApiModule {}
