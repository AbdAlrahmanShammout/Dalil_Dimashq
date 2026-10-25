import { Module } from '@nestjs/common';

import { AuthClientAppController } from '@/authentication/auth.client-app.controller';
import { AuthModule } from '@/authentication/auth.module';
import { AreaClientAppController } from '@/modules/area/area.client-app.controller';
import { AreaModule } from '@/modules/area/area.module';
import { AmenityClientAppController } from '@/modules/amenity/amenity.client-app.controller';
import { AmenityModule } from '@/modules/amenity/amenity.module';
import { OfferClientAppController } from '@/modules/offer/offer.client-app.controller';
import { OfferPlaceClientAppController } from '@/modules/offer/offer-place.client-app.controller';
import { OfferModule } from '@/modules/offer/offer.module';
import { PlacePhotoClientAppController } from '@/modules/place-photo/place-photo.client-app.controller';
import { PlacePhotoModule } from '@/modules/place-photo/place-photo.module';
import { PlaceHourClientAppController } from '@/modules/place-hour/place-hour.client-app.controller';
import { PlaceHourModule } from '@/modules/place-hour/place-hour.module';
import { PlaceClientAppController } from '@/modules/place/place.client-app.controller';
import { PlaceModule } from '@/modules/place/place.module';
import { SearchModule } from '@/modules/search/search.module';
import { AccountClientAppController } from '@/modules/user/account.client-app.controller';
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
  ],
  controllers: [
    AuthClientAppController,
    AccountClientAppController,
    AreaClientAppController,
    PlaceClientAppController,
    PlaceHourClientAppController,
    AmenityClientAppController,
    PlacePhotoClientAppController,
    OfferClientAppController,
    OfferPlaceClientAppController,
  ],
})
export class ClientAppApiModule {}
