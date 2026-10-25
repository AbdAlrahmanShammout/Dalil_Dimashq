export const VISITOR_NOTIFICATION_KINDS = [
  'booking_confirmed',
  'booking_rejected',
  'booking_expired',
  'booking_cancelled_by_owner',
  'fake_reported',
  'fake_report_decided',
  'booking_ban_started',
  'booking_ban_lifted',
] as const;

export const OWNER_NOTIFICATION_KINDS = [
  'booking_new',
  'booking_clock_started',
  'booking_cancelled_by_customer',
  'fake_report_new',
] as const;

export type VisitorNotificationKind = (typeof VISITOR_NOTIFICATION_KINDS)[number];
export type OwnerNotificationKind = (typeof OWNER_NOTIFICATION_KINDS)[number];

export interface RecordNotificationInput {
  readonly userId: string;
  readonly kind: VisitorNotificationKind;
  readonly bookingId: string | null;
  readonly createdAt: Date;
}

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
  abstract record(input: RecordNotificationInput): Promise<NotificationRow>;

  listForOwner(_userId: string): Promise<NotificationRow[]> {
    return Promise.resolve([]);
  }
}
