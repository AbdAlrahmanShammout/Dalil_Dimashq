export const DEFAULT_BOOKING_HORIZON_DAYS = 14;
export const DEFAULT_BOOKING_NOTICE_MINUTES = 60;
export const DEFAULT_BOOKING_MAX_PARTY = 8;
export const DEFAULT_BOOKING_REPLY_MINUTES = 60;

export interface ClosedPeriod {
  readonly startsAt: Date;
  readonly endsAt: Date;
}

export interface ResponseHour {
  readonly dayOfWeek: number;
  readonly opensAt: number;
  readonly closesAt: number;
}

export interface BookingAvailability {
  readonly acceptsBookings: boolean;
  readonly horizonDays: number;
  readonly noticeMinutes: number;
  readonly maxParty: number;
  readonly replyWindowMinutes: number;
  readonly closedPeriods: readonly ClosedPeriod[];
  readonly responseHours: readonly ResponseHour[];
  readonly openingHours: readonly ResponseHour[];
}

export abstract class BookingSettingsRepository {
  abstract read(placeId: string): Promise<BookingAvailability | null>;
}
