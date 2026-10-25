export interface BookingListItem {
  readonly id: string;
  readonly number: number;
  readonly placeId: string;
  readonly startsAt: Date;
  readonly partySize: number;
  readonly status: string;
}

export interface ListBookingsInput {
  readonly userId: string;
  readonly limit: number;
  readonly offset: number;
}

export const BOOKING_NOTE_MAX_LENGTH = 300;
export const BOOKING_PAGE_LIMIT = 20;

export interface BookingRecord {
  readonly id: string;
  readonly number: number;
  readonly clientKey: string;
  readonly placeId: string;
  readonly startsAt: Date;
  readonly partySize: number;
  readonly note: string | null;
  readonly offerId: string | null;
  readonly status: string;
}

export interface CreateBookingInput {
  readonly clientKey: string;
  readonly userId: string;
  readonly placeId: string;
  readonly startsAt: Date;
  readonly partySize: number;
  readonly note: string | null;
  readonly offerId: string | null;
}

export abstract class BookingRepository {
  abstract findByClientKey(userId: string, clientKey: string): Promise<BookingRecord | null>;
  abstract create(input: CreateBookingInput): Promise<BookingRecord>;
  abstract listForUser(
    input: ListBookingsInput,
  ): Promise<{ rows: BookingListItem[]; total: number }>;
}
