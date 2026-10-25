import { NotificationService } from '@/modules/notification/notification.service';
import {
  NotificationRepository,
  NotificationRow,
  VISITOR_NOTIFICATION_KINDS,
} from '@/modules/notification/repository/notification.repository';

class MemoryNotificationRepository extends NotificationRepository {
  async listForUser(): Promise<NotificationRow[]> {
    return [
      {
        id: 'newer',
        kind: 'booking_expired',
        bookingId: 'booking-1',
        readAt: null,
        createdAt: new Date('2026-10-25T12:00:00Z'),
      },
      {
        id: 'older',
        kind: 'booking_confirmed',
        bookingId: null,
        readAt: new Date('2026-10-25T09:00:00Z'),
        createdAt: new Date('2026-10-25T08:00:00Z'),
      },
    ];
  }

  async markRead(): Promise<NotificationRow | null> {
    return null;
  }

  async record(): Promise<NotificationRow> {
    return {
      id: 'recorded',
      kind: 'booking_expired',
      bookingId: null,
      readAt: null,
      createdAt: new Date('2026-10-25T12:00:00Z'),
    };
  }
}

class StoringNotificationRepository extends NotificationRepository {
  readonly rows: NotificationRow[] = [];

  async listForUser(): Promise<NotificationRow[]> {
    return this.rows;
  }

  async markRead(): Promise<NotificationRow | null> {
    return null;
  }

  async record(input: {
    userId: string;
    kind: NotificationRow['kind'];
    bookingId: string | null;
    createdAt: Date;
  }): Promise<NotificationRow> {
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

describe('NotificationService', () => {
  it('keeps the repository order and the read flag', async () => {
    const actual = await new NotificationService(new MemoryNotificationRepository()).listMine(
      'user-1',
    );
    expect(actual.map((row) => row.id)).toEqual(['newer', 'older']);
    expect(actual[1]?.readAt).toBeInstanceOf(Date);
  });

  it('stores each visitor notification kind', async () => {
    const repository = new StoringNotificationRepository();
    const service = new NotificationService(repository);
    for (const kind of VISITOR_NOTIFICATION_KINDS) {
      await service.recordVisitorNotice({ userId: 'user-1', kind, bookingId: 'booking-1' });
    }
    const actual = await service.listMine('user-1');
    expect(actual.map((row) => row.kind)).toEqual([...VISITOR_NOTIFICATION_KINDS]);
  });
});
