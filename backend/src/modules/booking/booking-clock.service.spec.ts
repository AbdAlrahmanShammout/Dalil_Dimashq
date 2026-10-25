import { BookingClockService } from '@/modules/booking/booking-clock.service';
import { BookingPushNotifier } from '@/modules/booking/booking-push';
import {
  BookingClockRepository,
  PendingBookingClockRow,
} from '@/modules/booking/repository/booking-clock.repository';

class MemoryClockRepository extends BookingClockRepository {
  readonly expired: string[] = [];

  async listPending(): Promise<PendingBookingClockRow[]> {
    return [
      {
        id: 'due',
        userId: 'user-1',
        createdAt: new Date('2026-10-25T10:00:00Z'),
        replyWindowMinutes: 60,
      },
      {
        id: 'waiting',
        userId: 'user-1',
        createdAt: new Date('2026-10-25T12:30:00Z'),
        replyWindowMinutes: 60,
      },
    ];
  }

  async expire(rows: readonly PendingBookingClockRow[]): Promise<void> {
    this.expired.push(...rows.map((row) => row.id));
  }
}

describe('BookingClockService', () => {
  it('expires only the booking whose reply window has ended', async () => {
    const repository = new MemoryClockRepository();
    const sent: string[] = [];
    const push = new (class extends BookingPushNotifier {
      async notify(rows: readonly { bookingId: string }[]): Promise<void> {
        sent.push(...rows.map((row) => row.bookingId));
      }
    })();
    const actual = await new BookingClockService(repository, push).expireDue(
      new Date('2026-10-25T12:00:00Z'),
    );
    expect(actual).toBe(1);
    expect(repository.expired).toEqual(['due']);
    expect(sent).toEqual(['due']);
  });
});
