import { Module, OnModuleInit } from '@nestjs/common';

import { BookingAvailabilityService } from '@/modules/booking/booking-availability.service';
import {
  BOOKING_REPLY_CLOCK_MS,
  BookingClockService,
} from '@/modules/booking/booking-clock.service';
import { BookingGateService } from '@/modules/booking/booking-gate.service';
import { BookingService } from '@/modules/booking/booking.service';
import { BookingClockPrismaRepository } from '@/modules/booking/repository/booking-clock-prisma.repository';
import { BookingClockRepository } from '@/modules/booking/repository/booking-clock.repository';
import { BookingPrismaRepository } from '@/modules/booking/repository/booking-prisma.repository';
import { BookingRepository } from '@/modules/booking/repository/booking.repository';
import { CurrentOfferPrismaRepository } from '@/modules/booking/repository/current-offer-prisma.repository';
import { CurrentOfferRepository } from '@/modules/booking/repository/current-offer.repository';
import { BookingBanPrismaRepository } from '@/modules/booking/repository/booking-ban-prisma.repository';
import { BookingBanRepository } from '@/modules/booking/repository/booking-ban.repository';
import { BookingSettingsPrismaRepository } from '@/modules/booking/repository/booking-settings-prisma.repository';
import { BookingSettingsRepository } from '@/modules/booking/repository/booking-settings.repository';
import { NotificationModule } from '@/modules/notification/notification.module';
import { PlaceModule } from '@/modules/place/place.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';
import { BookingPushNotifier, FirebaseBookingPushNotifier } from '@/modules/booking/booking-push';
import { DeviceModule } from '@/modules/device/device.module';
import { SchedulerManagerService } from '@/providers/scheduler/scheduler-manager.service';
import { SchedulerProviderModule } from '@/providers/scheduler/scheduler-provider.module';
import { FirebaseProviderModule } from '@/providers/firebase/firebase-provider.module';

@Module({
  imports: [
    DatabaseProviderModule,
    PlaceModule,
    SchedulerProviderModule,
    DeviceModule,
    FirebaseProviderModule,
    NotificationModule,
  ],
  providers: [
    BookingAvailabilityService,
    BookingGateService,
    BookingService,
    BookingClockService,
    { provide: BookingSettingsRepository, useClass: BookingSettingsPrismaRepository },
    { provide: BookingBanRepository, useClass: BookingBanPrismaRepository },
    { provide: BookingRepository, useClass: BookingPrismaRepository },
    { provide: CurrentOfferRepository, useClass: CurrentOfferPrismaRepository },
    { provide: BookingClockRepository, useClass: BookingClockPrismaRepository },
    { provide: BookingPushNotifier, useClass: FirebaseBookingPushNotifier },
  ],
  exports: [BookingAvailabilityService, BookingGateService, BookingService, BookingClockService],
})
export class BookingModule implements OnModuleInit {
  constructor(
    private readonly schedulerManagerService: SchedulerManagerService,
    private readonly bookingClockService: BookingClockService,
  ) {}

  onModuleInit(): void {
    this.schedulerManagerService.register(
      'booking-reply-clock',
      BOOKING_REPLY_CLOCK_MS,
      async () => {
        await this.bookingClockService.expireDue(new Date());
      },
    );
  }
}
