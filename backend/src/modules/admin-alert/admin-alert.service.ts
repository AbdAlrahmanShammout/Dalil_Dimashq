import { Injectable } from '@nestjs/common';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import {
  AdminAlertItem,
  AdminAlertRepository,
} from '@/modules/admin-alert/repository/admin-alert.repository';

@Injectable()
export class AdminAlertService {
  constructor(private readonly adminAlertRepository: AdminAlertRepository) {}

  /**
   * Operational alerts that nobody has marked read.
   */
  async listUnread(): Promise<AdminAlertItem[]> {
    return this.adminAlertRepository.listUnread();
  }

  /**
   * Marks one unread alert. A second mark is refused.
   */
  async markRead(id: string, readAt: Date = new Date()): Promise<void> {
    const result = await this.adminAlertRepository.markRead(id, readAt);
    if (result === 'missing') {
      throw new ResourceNotFoundException('AdminAlert', id);
    }
    if (result === 'read') {
      throw new InvalidStateException({ message: 'Already read', code: 'invalid_state' });
    }
  }

  /**
   * How many alerts are still unread.
   */
  async countUnread(): Promise<number> {
    return this.adminAlertRepository.countUnread();
  }
}
