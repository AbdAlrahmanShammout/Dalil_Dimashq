export interface ActiveBan {
  readonly level: number;
  readonly endsAt: Date | null;
}

export abstract class BookingBanRepository {
  abstract findActive(userId: string, now: Date): Promise<ActiveBan | null>;
}
