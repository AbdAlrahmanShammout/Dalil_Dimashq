export interface OwnedFakeReport {
  readonly id: string;
  readonly status: string;
}

export abstract class FakeReportRepository {
  abstract findOwned(userId: string, reportId: string): Promise<OwnedFakeReport | null>;
  abstract addReply(reportId: string, body: string): Promise<{ id: string }>;
}
