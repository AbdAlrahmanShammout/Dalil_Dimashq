import { Injectable } from '@nestjs/common';

import {
  BookingAvailability,
  BookingSettingsRepository,
  DEFAULT_BOOKING_HORIZON_DAYS,
  DEFAULT_BOOKING_MAX_PARTY,
  DEFAULT_BOOKING_NOTICE_MINUTES,
  DEFAULT_BOOKING_REPLY_MINUTES,
  OwnerBookingSettings,
  SaveOwnerBookingSettingsInput,
  SaveResponseHourInput,
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
      where: { placeId, season: 'regular' },
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

  override async readOwner(placeId: string): Promise<OwnerBookingSettings> {
    const row = await this.prisma.placeBookingSettings.findUnique({ where: { placeId } });
    return this.toOwnerSettings(row);
  }

  override async saveOwner(input: SaveOwnerBookingSettingsInput): Promise<OwnerBookingSettings> {
    const current = await this.prisma.placeBookingSettings.findUnique({
      where: { placeId: input.placeId },
    });
    const noticeMinutes =
      input.noticeMinutes ?? current?.noticeMinutes ?? DEFAULT_BOOKING_NOTICE_MINUTES;
    const row = await this.prisma.placeBookingSettings.upsert({
      where: { placeId: input.placeId },
      create: {
        placeId: input.placeId,
        acceptsBookings: input.acceptsBookings,
        maxParty: input.maxParty,
        noticeMinutes,
      },
      update: {
        acceptsBookings: input.acceptsBookings,
        maxParty: input.maxParty,
        noticeMinutes,
      },
    });
    return this.toOwnerSettings(row);
  }

  override async addResponseHour(input: SaveResponseHourInput): Promise<{ id: string }> {
    const row = await this.prisma.bookingResponseHour.create({
      data: {
        placeId: input.placeId,
        dayOfWeek: input.dayOfWeek,
        opensAt: input.opensAt,
        closesAt: input.closesAt,
      },
    });
    return { id: row.id };
  }

  override async deleteResponseHour(placeId: string, hourId: string): Promise<boolean> {
    const result = await this.prisma.bookingResponseHour.deleteMany({
      where: { id: hourId, placeId },
    });
    return result.count > 0;
  }

  private toOwnerSettings(
    row: { acceptsBookings: boolean; maxParty: number; noticeMinutes: number } | null,
  ): OwnerBookingSettings {
    return {
      acceptsBookings: row?.acceptsBookings ?? false,
      maxParty: row?.maxParty ?? DEFAULT_BOOKING_MAX_PARTY,
      noticeMinutes: row?.noticeMinutes ?? DEFAULT_BOOKING_NOTICE_MINUTES,
    };
  }
}
