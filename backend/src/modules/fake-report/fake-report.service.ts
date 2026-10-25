import { Injectable } from '@nestjs/common';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { FakeReportRepository } from '@/modules/fake-report/repository/fake-report.repository';
import { readDamascusMonth } from '@/modules/fake-report/damascus-month';

const MONTHLY_FAKE_REPORT_LIMIT = 5;

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

  /**
   * One open report for a booking that was not attended, at most five per place each Damascus month.
   */
  async reportBooking(input: {
    readonly userId: string;
    readonly placeId: string;
    readonly bookingId: string;
    readonly status: string;
    readonly reason: string;
    readonly now?: Date;
  }): Promise<{ id: string }> {
    const reason = input.reason.trim();
    if (!reason) {
      throw new InvalidStateException({ message: 'Reason is required', code: 'fake_reason' });
    }
    if (input.status === 'attended') {
      throw new InvalidStateException({
        message: 'An attended booking cannot be reported',
        code: 'fake_attended',
      });
    }
    const existing = await this.fakeReportRepository.findByBooking(input.bookingId);
    if (existing) {
      throw new InvalidStateException({ message: 'Already reported', code: 'fake_duplicate' });
    }
    const now = input.now ?? new Date();
    const month = readDamascusMonth(now);
    const count = await this.fakeReportRepository.countForPlace(
      input.placeId,
      month.from,
      month.until,
    );
    if (count >= MONTHLY_FAKE_REPORT_LIMIT) {
      throw new InvalidStateException({
        message: 'Monthly limit reached',
        code: 'fake_monthly_limit',
      });
    }
    const created = await this.fakeReportRepository.createBookingReport({
      userId: input.userId,
      placeId: input.placeId,
      bookingId: input.bookingId,
      message: reason,
    });
    if (!created) {
      throw new InvalidStateException({ message: 'Already reported', code: 'fake_duplicate' });
    }
    return created;
  }
}
