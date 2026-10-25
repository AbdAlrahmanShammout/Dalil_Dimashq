import { BookingClockService } from '@/modules/booking/booking-clock.service';
import { BookingPushNotifier } from '@/modules/booking/booking-push';
import { NotificationService } from '@/modules/notification/notification.service';
import {
  NotificationRepository,
  NotificationRow,
  RecordNotificationInput,
} from '@/modules/notification/repository/notification.repository';
import {
  BookingClockRepository,
  PendingBookingClockRow,
} from '@/modules/booking/repository/booking-clock.repository';

class MemoryNoteRepository extends NotificationRepository {
  readonly rows: NotificationRow[] = [];

  async listForUser(): Promise<NotificationRow[]> {
    return this.rows;
  }

  async markRead(): Promise<NotificationRow | null> {
    return null;
  }

  async record(input: RecordNotificationInput): Promise<NotificationRow> {
    const row: NotificationRow = {
      id: `note-${this.rows.length + 1}`,
      kind: input.kind,
      bookingId: input.bookingId,
      readAt: null,
      createdAt: input.createdAt,
    };
    this.rows.push(row);
    return row;
  }
}

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
    const notes = new MemoryNoteRepository();
    const actual = await new BookingClockService(
      repository,
      push,
      new NotificationService(notes),
    ).expireDue(new Date('2026-10-25T12:00:00Z'));
    expect(actual).toBe(1);
    expect(repository.expired).toEqual(['due']);
    expect(sent).toEqual(['due']);
    expect(notes.rows.map((row) => row.kind)).toEqual(['booking_expired']);
  });
});
