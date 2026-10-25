export interface NotificationRow {
  readonly id: string;
  readonly kind: string;
  readonly bookingId: string | null;
  readonly readAt: Date | null;
  readonly createdAt: Date;
}

export abstract class NotificationRepository {
  abstract listForUser(userId: string): Promise<NotificationRow[]>;
  abstract markRead(
    userId: string,
    notificationId: string,
    readAt: Date,
  ): Promise<NotificationRow | null>;
}
