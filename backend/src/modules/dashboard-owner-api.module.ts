import { Module } from '@nestjs/common';

import { AuthDashboardOwnerController } from '@/authentication/auth.dashboard-owner.controller';
import { AuthModule } from '@/authentication/auth.module';
import { DeviceDashboardOwnerController } from '@/modules/device/device.dashboard-owner.controller';
import { DeviceModule } from '@/modules/device/device.module';
import { OwnerPlaceDashboardController } from '@/modules/owner-place/owner-place.dashboard-owner.controller';
import { OwnerPlaceModule } from '@/modules/owner-place/owner-place.module';
import { AmenityDashboardOwnerController } from '@/modules/amenity/amenity.dashboard-owner.controller';
import { OwnerBookingDashboardController } from '@/modules/booking/owner-booking.dashboard-owner.controller';
import { OfferDashboardOwnerController } from '@/modules/offer/offer.dashboard-owner.controller';
import { PlacePhotoDashboardOwnerController } from '@/modules/place-photo/place-photo.dashboard-owner.controller';
import { AccountDashboardOwnerController } from '@/modules/user/account.dashboard-owner.controller';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule, DeviceModule, OwnerPlaceModule],
  controllers: [
    AuthDashboardOwnerController,
    AccountDashboardOwnerController,
    DeviceDashboardOwnerController,
    OwnerPlaceDashboardController,
    AmenityDashboardOwnerController,
    PlacePhotoDashboardOwnerController,
    OfferDashboardOwnerController,
    OwnerBookingDashboardController,
  ],
})
export class DashboardOwnerApiModule {}
