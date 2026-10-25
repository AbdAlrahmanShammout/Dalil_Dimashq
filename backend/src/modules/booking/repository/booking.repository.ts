import { TransactionContext } from '@/common/base/transaction-runner';

export interface BookingDetail {
  readonly id: string;
  readonly number: number;
  readonly status: string;
  readonly place: { readonly id: string; readonly nameAr: string; readonly nameEn: string };
  readonly startsAt: Date;
  readonly partySize: number;
  readonly note: string | null;
  readonly rejectionReason: string | null;
  readonly cancellationReason: string | null;
}

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

export interface OwnerBookingRow {
  readonly id: string;
  readonly name: string;
  readonly phone: string | null;
  readonly partySize: number;
  readonly startsAt: Date;
  readonly note: string | null;
  readonly status: string;
  readonly reported: boolean;
}

export interface PlaceBooking {
  readonly id: string;
  readonly userId: string;
  readonly status: string;
  readonly startsAt: Date;
}

export interface DecideBookingInput {
  readonly placeId: string;
  readonly bookingId: string;
  readonly status: 'confirmed' | 'rejected' | 'cancelled_by_owner' | 'attended' | 'no_show';
  readonly fromStatuses: readonly string[];
  readonly rejectionReason?: string | null;
  readonly cancellationReason?: string | null;
}

export abstract class BookingRepository {
  abstract findByClientKey(userId: string, clientKey: string): Promise<BookingRecord | null>;
  abstract create(input: CreateBookingInput): Promise<BookingRecord>;
  abstract listForUser(
    input: ListBookingsInput,
  ): Promise<{ rows: BookingListItem[]; total: number }>;
  abstract findOwned(userId: string, bookingId: string): Promise<BookingDetail | null>;
  abstract markCancelledByCustomer(
    userId: string,
    bookingId: string,
  ): Promise<BookingDetail | null>;

  listForPlace(_placeId: string): Promise<OwnerBookingRow[]> {
    return Promise.resolve([]);
  }

  findForPlace(_placeId: string, _bookingId: string): Promise<PlaceBooking | null> {
    return Promise.resolve(null);
  }

  decide(_input: DecideBookingInput, _context?: TransactionContext): Promise<boolean> {
    return Promise.resolve(false);
  }

  listNoShows(_from: Date, _minimum: number): Promise<NoShowWatchRow[]> {
    return Promise.resolve([]);
  }
}

export interface NoShowWatchRow {
  readonly userId: string;
  readonly email: string;
  readonly count: number;
}
