import { Injectable } from '@nestjs/common';

import {
  DEFAULT_BOOKING_HORIZON_DAYS,
  DEFAULT_BOOKING_MAX_PARTY,
  DEFAULT_BOOKING_NOTICE_MINUTES,
  DEFAULT_BOOKING_REPLY_MINUTES,
} from '@/modules/booking/repository/booking-settings.repository';
import {
  BookingAvailability,
  BookingSettingsRepository,
} from '@/modules/booking/repository/booking-settings.repository';
import { PlaceService } from '@/modules/place/place.service';

@Injectable()
export class BookingAvailabilityService {
  constructor(
    private readonly placeService: PlaceService,
    private readonly bookingSettingsRepository: BookingSettingsRepository,
  ) {}

  /**
   * Public booking rules. A place with no settings does not accept bookings.
   */
  async read(placeId: string): Promise<BookingAvailability> {
    await this.placeService.getPublicPlace(placeId);
    const stored = await this.bookingSettingsRepository.read(placeId);
    return (
      stored ?? {
        acceptsBookings: false,
        horizonDays: DEFAULT_BOOKING_HORIZON_DAYS,
        noticeMinutes: DEFAULT_BOOKING_NOTICE_MINUTES,
        maxParty: DEFAULT_BOOKING_MAX_PARTY,
        replyWindowMinutes: DEFAULT_BOOKING_REPLY_MINUTES,
        closedPeriods: [],
        responseHours: [],
      }
    );
  }
}
