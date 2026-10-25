import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import {
  NotificationRepository,
  NotificationRow,
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
}
