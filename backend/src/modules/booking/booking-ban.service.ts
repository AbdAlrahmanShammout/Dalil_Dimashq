import { Injectable } from '@nestjs/common';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { BookingBanRepository } from '@/modules/booking/repository/booking-ban.repository';

@Injectable()
export class BookingBanService {
  constructor(private readonly bookingBanRepository: BookingBanRepository) {}

  /**
   * Ends a ban early. A lifted ban does not count toward the next one.
   */
  async lift(id: string, note: string, now: Date = new Date()): Promise<void> {
    const trimmed = note.trim();
    if (!trimmed) {
      throw new InvalidStateException({ message: 'Reason is required', code: 'reason' });
    }
    const result = await this.bookingBanRepository.lift(id, trimmed, now);
    if (result === 'missing') {
      throw new ResourceNotFoundException('BookingBan', id);
    }
    if (result === 'lifted') {
      throw new InvalidStateException({ message: 'Already lifted', code: 'invalid_state' });
    }
  }
}
