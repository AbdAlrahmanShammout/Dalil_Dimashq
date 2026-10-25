export interface ActiveBan {
  readonly level: number;
  readonly endsAt: Date | null;
}

export abstract class BookingBanRepository {
  abstract findActive(userId: string, now: Date): Promise<ActiveBan | null>;

  lift(_id: string, _note: string, _liftedAt: Date): Promise<'missing' | 'lifted' | 'saved'> {
    return Promise.resolve('missing');
  }
}
