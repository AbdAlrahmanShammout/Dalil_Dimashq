import { Injectable, Optional } from '@nestjs/common';

import { AuditLogService, writeStaffAudit } from '@/modules/audit-log/audit-log.service';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { BookingBanRepository } from '@/modules/booking/repository/booking-ban.repository';

@Injectable()
export class BookingBanService {
  constructor(
    private readonly bookingBanRepository: BookingBanRepository,
    @Optional() private readonly auditLogService?: AuditLogService,
  ) {}

  /**
   * Ends a ban early. A lifted ban does not count toward the next one.
   */
  async lift(id: string, note: string, now: Date = new Date(), actorId?: string): Promise<void> {
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
    await writeStaffAudit(this.auditLogService, {
      actorId,
      action: 'ban_lifted',
      targetType: 'booking_ban',
      targetId: id,
      note: trimmed,
    });
  }
}
