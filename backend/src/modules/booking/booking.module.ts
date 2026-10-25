import { Module } from '@nestjs/common';

import { BookingAvailabilityService } from '@/modules/booking/booking-availability.service';
import { BookingGateService } from '@/modules/booking/booking-gate.service';
import { BookingService } from '@/modules/booking/booking.service';
import { BookingPrismaRepository } from '@/modules/booking/repository/booking-prisma.repository';
import { BookingRepository } from '@/modules/booking/repository/booking.repository';
import { BookingBanPrismaRepository } from '@/modules/booking/repository/booking-ban-prisma.repository';
import { BookingBanRepository } from '@/modules/booking/repository/booking-ban.repository';
import { BookingSettingsPrismaRepository } from '@/modules/booking/repository/booking-settings-prisma.repository';
import { BookingSettingsRepository } from '@/modules/booking/repository/booking-settings.repository';
import { PlaceModule } from '@/modules/place/place.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, PlaceModule],
  providers: [
    BookingAvailabilityService,
    BookingGateService,
    BookingService,
    { provide: BookingSettingsRepository, useClass: BookingSettingsPrismaRepository },
    { provide: BookingBanRepository, useClass: BookingBanPrismaRepository },
    { provide: BookingRepository, useClass: BookingPrismaRepository },
  ],
  exports: [BookingAvailabilityService, BookingGateService, BookingService],
})
export class BookingModule {}
