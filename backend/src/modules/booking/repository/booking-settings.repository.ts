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

export interface OwnerBookingSettings {
  readonly acceptsBookings: boolean;
  readonly maxParty: number;
  readonly noticeMinutes: number;
}

export interface SaveOwnerBookingSettingsInput {
  readonly placeId: string;
  readonly acceptsBookings: boolean;
  readonly maxParty: number;
  readonly noticeMinutes: number | null;
}

export interface SaveResponseHourInput {
  readonly placeId: string;
  readonly dayOfWeek: number;
  readonly opensAt: number;
  readonly closesAt: number;
}

export interface SaveBlackoutInput {
  readonly placeId: string;
  readonly startsAt: Date;
  readonly endsAt: Date;
}

export abstract class BookingSettingsRepository {
  abstract read(placeId: string): Promise<BookingAvailability | null>;

  readOwner(_placeId: string): Promise<OwnerBookingSettings> {
    return Promise.resolve({
      acceptsBookings: false,
      maxParty: DEFAULT_BOOKING_MAX_PARTY,
      noticeMinutes: DEFAULT_BOOKING_NOTICE_MINUTES,
    });
  }

  saveOwner(input: SaveOwnerBookingSettingsInput): Promise<OwnerBookingSettings> {
    return Promise.resolve({
      acceptsBookings: input.acceptsBookings,
      maxParty: input.maxParty,
      noticeMinutes: input.noticeMinutes ?? DEFAULT_BOOKING_NOTICE_MINUTES,
    });
  }

  addResponseHour(_input: SaveResponseHourInput): Promise<{ id: string }> {
    return Promise.reject(new Error('addResponseHour is not implemented'));
  }

  deleteResponseHour(_placeId: string, _hourId: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  addBlackout(_input: SaveBlackoutInput): Promise<{ id: string }> {
    return Promise.reject(new Error('addBlackout is not implemented'));
  }

  deleteBlackout(_placeId: string, _blackoutId: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}
