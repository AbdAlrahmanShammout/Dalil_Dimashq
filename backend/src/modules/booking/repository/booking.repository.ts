export const BOOKING_NOTE_MAX_LENGTH = 300;

export interface BookingRecord {
  readonly id: string;
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
}

export abstract class BookingRepository {
  abstract findByClientKey(userId: string, clientKey: string): Promise<BookingRecord | null>;
  abstract create(input: CreateBookingInput): Promise<BookingRecord>;
}
