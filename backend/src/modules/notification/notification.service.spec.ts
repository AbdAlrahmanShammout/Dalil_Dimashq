import { NotificationService } from '@/modules/notification/notification.service';
import {
  NotificationRepository,
  NotificationRow,
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
}

describe('NotificationService', () => {
  it('keeps the repository order and the read flag', async () => {
    const actual = await new NotificationService(new MemoryNotificationRepository()).listMine(
      'user-1',
    );
    expect(actual.map((row) => row.id)).toEqual(['newer', 'older']);
    expect(actual[1]?.readAt).toBeInstanceOf(Date);
  });
});
