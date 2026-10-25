import { Injectable } from '@nestjs/common';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { FakeReportRepository } from '@/modules/fake-report/repository/fake-report.repository';

@Injectable()
export class FakeReportService {
  constructor(private readonly fakeReportRepository: FakeReportRepository) {}

  /**
   * Stores the visitor reply while the report is still open.
   */
  async reply(input: {
    readonly userId: string;
    readonly reportId: string;
    readonly body: string;
  }): Promise<{ id: string }> {
    const report = await this.fakeReportRepository.findOwned(input.userId, input.reportId);
    if (!report) {
      throw new ResourceNotFoundException('FakeReport', input.reportId);
    }
    if (report.status !== 'open') {
      throw new InvalidStateException({ message: 'The report is not open', code: 'invalid_state' });
    }
    return this.fakeReportRepository.addReply(report.id, input.body);
  }
}
