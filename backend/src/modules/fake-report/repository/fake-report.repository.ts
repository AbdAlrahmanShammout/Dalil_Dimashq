export interface OwnedFakeReport {
  readonly id: string;
  readonly status: string;
}

export interface CreateBookingReportInput {
  readonly userId: string;
  readonly placeId: string;
  readonly bookingId: string;
  readonly message: string;
}

export abstract class FakeReportRepository {
  abstract findOwned(userId: string, reportId: string): Promise<OwnedFakeReport | null>;
  abstract addReply(reportId: string, body: string): Promise<{ id: string }>;

  findByBooking(_bookingId: string): Promise<{ id: string } | null> {
    return Promise.resolve(null);
  }

  countForPlace(_placeId: string, _from: Date, _until: Date): Promise<number> {
    return Promise.resolve(0);
  }

  createBookingReport(_input: CreateBookingReportInput): Promise<{ id: string } | null> {
    return Promise.resolve(null);
  }
}
