import { FakeReportService } from '@/modules/fake-report/fake-report.service';
import {
  FakeReportRepository,
  OwnedFakeReport,
} from '@/modules/fake-report/repository/fake-report.repository';

class MemoryFakeReportRepository extends FakeReportRepository {
  constructor(private readonly report: OwnedFakeReport | null) {
    super();
  }

  async findOwned(): Promise<OwnedFakeReport | null> {
    return this.report;
  }

  async addReply(): Promise<{ id: string }> {
    return { id: 'reply-1' };
  }
}

describe('FakeReportService', () => {
  it('replies only while the report is open', async () => {
    const open = new FakeReportService(
      new MemoryFakeReportRepository({ id: 'report-1', status: 'open' }),
    );
    await expect(
      open.reply({ userId: 'user-1', reportId: 'report-1', body: 'I did attend' }),
    ).resolves.toEqual({
      id: 'reply-1',
    });
    const closed = new FakeReportService(
      new MemoryFakeReportRepository({ id: 'report-1', status: 'confirmed' }),
    );
    await expect(
      closed.reply({ userId: 'user-1', reportId: 'report-1', body: 'late' }),
    ).rejects.toMatchObject({
      code: 'invalid_state',
    });
  });
});
