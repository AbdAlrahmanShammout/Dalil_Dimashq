export interface PendingBookingClockRow {
  readonly id: string;
  readonly userId: string;
  readonly createdAt: Date;
  readonly replyWindowMinutes: number;
}

export abstract class BookingClockRepository {
  abstract listPending(): Promise<PendingBookingClockRow[]>;
  abstract expire(rows: readonly PendingBookingClockRow[], now: Date): Promise<void>;
}
