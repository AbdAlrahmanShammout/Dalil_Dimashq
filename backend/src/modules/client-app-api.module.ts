import { Module } from '@nestjs/common';

import { AuthClientAppController } from '@/authentication/auth.client-app.controller';
import { AuthModule } from '@/authentication/auth.module';
import { AreaClientAppController } from '@/modules/area/area.client-app.controller';
import { AreaModule } from '@/modules/area/area.module';
import { AmenityClientAppController } from '@/modules/amenity/amenity.client-app.controller';
import { AmenityModule } from '@/modules/amenity/amenity.module';
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
  ],
  controllers: [
    AuthClientAppController,
    AccountClientAppController,
    AreaClientAppController,
    PlaceClientAppController,
    PlaceHourClientAppController,
    AmenityClientAppController,
  ],
})
export class ClientAppApiModule {}
