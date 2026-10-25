import { Injectable } from '@nestjs/common';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import {
  NotificationRepository,
  NotificationRow,
  VISITOR_NOTIFICATION_KINDS,
  VisitorNotificationKind,
} from '@/modules/notification/repository/notification.repository';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  /**
   * Booking and report rows for the caller, newest first.
   */
  async listMine(userId: string): Promise<NotificationRow[]> {
    return this.notificationRepository.listForUser(userId);
  }

  /**
   * Owner inbox: new bookings, the reply clock, customer cancels, and new fake reports.
   */
  async listOwner(userId: string): Promise<NotificationRow[]> {
    return this.notificationRepository.listForOwner(userId);
  }

  /**
   * Sets readAt on the caller's row and leaves another visitor's row untouched.
   */
  async markRead(
    userId: string,
    notificationId: string,
    readAt: Date = new Date(),
  ): Promise<NotificationRow> {
    const row = await this.notificationRepository.markRead(userId, notificationId, readAt);
    if (!row) {
      throw new ResourceNotFoundException('Notification', notificationId);
    }
    return row;
  }

  /**
   * Stores one visitor notice. Later booking and report writers call this same method.
   */
  async recordVisitorNotice(input: {
    readonly userId: string;
    readonly kind: string;
    readonly bookingId?: string | null;
    readonly now?: Date;
  }): Promise<NotificationRow> {
    if (!VISITOR_NOTIFICATION_KINDS.includes(input.kind as VisitorNotificationKind)) {
      throw new InvalidStateException({
        message: 'Unknown notification kind',
        code: 'kind_invalid',
      });
    }
    return this.notificationRepository.record({
      userId: input.userId,
      kind: input.kind as VisitorNotificationKind,
      bookingId: input.bookingId ?? null,
      createdAt: input.now ?? new Date(),
    });
  }
}
