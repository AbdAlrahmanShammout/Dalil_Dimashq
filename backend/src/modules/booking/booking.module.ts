import { Module } from '@nestjs/common';

import { BookingAvailabilityService } from '@/modules/booking/booking-availability.service';
import { BookingSettingsPrismaRepository } from '@/modules/booking/repository/booking-settings-prisma.repository';
import { BookingSettingsRepository } from '@/modules/booking/repository/booking-settings.repository';
import { PlaceModule } from '@/modules/place/place.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, PlaceModule],
  providers: [
    BookingAvailabilityService,
    { provide: BookingSettingsRepository, useClass: BookingSettingsPrismaRepository },
  ],
  exports: [BookingAvailabilityService],
})
export class BookingModule {}
