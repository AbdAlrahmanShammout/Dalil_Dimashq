import { Injectable } from '@nestjs/common';

import { TransactionContext } from '@/common/base/transaction-runner';
import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import {
  NotificationRepository,
  NotificationRow,
  OWNER_NOTIFICATION_KINDS,
  StoredNotificationKind,
  VISITOR_NOTIFICATION_KINDS,
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
    if (!(VISITOR_NOTIFICATION_KINDS as readonly string[]).includes(input.kind)) {
      throw new InvalidStateException({
        message: 'Unknown notification kind',
        code: 'kind_invalid',
      });
    }
    return this.recordNotice(input);
  }

  /**
   * Stores one visitor or owner notice. Pass the caller's transaction so the row commits with it.
   */
  async recordNotice(input: {
    readonly userId: string;
    readonly kind: string;
    readonly bookingId?: string | null;
    readonly now?: Date;
    readonly context?: TransactionContext;
  }): Promise<NotificationRow> {
    if (!this.isStoredKind(input.kind)) {
      throw new InvalidStateException({
        message: 'Unknown notification kind',
        code: 'kind_invalid',
      });
    }
    return this.notificationRepository.record({
      userId: input.userId,
      kind: input.kind,
      bookingId: input.bookingId ?? null,
      createdAt: input.now ?? new Date(),
      context: input.context,
    });
  }

  private isStoredKind(kind: string): kind is StoredNotificationKind {
    const visitor = (VISITOR_NOTIFICATION_KINDS as readonly string[]).includes(kind);
    const owner = (OWNER_NOTIFICATION_KINDS as readonly string[]).includes(kind);
    return visitor || owner;
  }
}
