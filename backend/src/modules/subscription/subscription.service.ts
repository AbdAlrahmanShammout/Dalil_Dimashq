import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import {
  SubscriptionRecord,
  SubscriptionRepository,
} from '@/modules/subscription/repository/subscription.repository';

@Injectable()
export class SubscriptionService {
  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

  /**
   * Opens a Premium window. Premium is active while `endsAt` is still ahead.
   */
  async create(input: { placeId: string; endsAt: Date }): Promise<SubscriptionRecord> {
    const created = await this.subscriptionRepository.create(input);
    if (!created) {
      throw new ResourceNotFoundException('Place', input.placeId);
    }
    return created;
  }

  /**
   * Moves the end of an existing Premium window.
   */
  async update(id: string, endsAt: Date): Promise<SubscriptionRecord> {
    const updated = await this.subscriptionRepository.updateEndsAt(id, endsAt);
    if (!updated) {
      throw new ResourceNotFoundException('Subscription', id);
    }
    return updated;
  }
}
