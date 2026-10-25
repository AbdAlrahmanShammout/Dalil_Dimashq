import { Injectable } from '@nestjs/common';

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
}
