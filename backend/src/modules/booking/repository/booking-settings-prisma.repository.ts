import { Injectable } from '@nestjs/common';

import {
  BookingAvailability,
  BookingSettingsRepository,
  DEFAULT_BOOKING_HORIZON_DAYS,
  DEFAULT_BOOKING_MAX_PARTY,
  DEFAULT_BOOKING_NOTICE_MINUTES,
  DEFAULT_BOOKING_REPLY_MINUTES,
} from '@/modules/booking/repository/booking-settings.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class BookingSettingsPrismaRepository extends BookingSettingsRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async read(placeId: string): Promise<BookingAvailability | null> {
    const settings = await this.prisma.placeBookingSettings.findUnique({ where: { placeId } });
    const blackouts = await this.prisma.bookingBlackout.findMany({
      where: { placeId },
      orderBy: { startsAt: 'asc' },
    });
    const responseHours = await this.prisma.bookingResponseHour.findMany({
      where: { placeId },
      orderBy: { dayOfWeek: 'asc' },
    });
    const openingHours = await this.prisma.placeHour.findMany({
      where: { placeId },
      orderBy: { dayOfWeek: 'asc' },
    });
    if (
      !settings &&
      blackouts.length === 0 &&
      responseHours.length === 0 &&
      openingHours.length === 0
    ) {
      return null;
    }
    return {
      acceptsBookings: settings?.acceptsBookings ?? false,
      horizonDays: settings?.horizonDays ?? DEFAULT_BOOKING_HORIZON_DAYS,
      noticeMinutes: settings?.noticeMinutes ?? DEFAULT_BOOKING_NOTICE_MINUTES,
      maxParty: settings?.maxParty ?? DEFAULT_BOOKING_MAX_PARTY,
      replyWindowMinutes: settings?.replyWindowMinutes ?? DEFAULT_BOOKING_REPLY_MINUTES,
      closedPeriods: blackouts.map((row) => ({ startsAt: row.startsAt, endsAt: row.endsAt })),
      responseHours: responseHours.map((row) => ({
        dayOfWeek: row.dayOfWeek,
        opensAt: row.opensAt,
        closesAt: row.closesAt,
      })),
      openingHours: openingHours.map((row) => ({
        dayOfWeek: row.dayOfWeek,
        opensAt: row.opensAt,
        closesAt: row.closesAt,
      })),
    };
  }
}
