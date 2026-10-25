import { Injectable } from '@nestjs/common';

import {
  AuditLogPage,
  AuditLogRepository,
  RecordAuditInput,
} from '@/modules/audit-log/repository/audit-log.repository';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/modules/place/enum/general.enum';

@Injectable()
export class AuditLogService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  /**
   * Stores one staff action. Callers pass the actor from the admin token.
   */
  async record(input: RecordAuditInput): Promise<void> {
    await this.auditLogRepository.record(input);
  }

  /**
   * Newest staff actions first.
   */
  async list(input: {
    limit?: number;
    offset?: number;
  }): Promise<AuditLogPage & { limit: number; offset: number }> {
    const limit = input.limit ?? DEFAULT_PAGE_LIMIT;
    const offset = input.offset ?? DEFAULT_PAGE_OFFSET;
    const page = await this.auditLogRepository.list(limit, offset);
    return { ...page, limit, offset };
  }
}

/**
 * Writes a staff action when both the service and the actor are present.
 */
export async function writeStaffAudit(
  auditLogService: AuditLogService | undefined,
  input: {
    readonly actorId?: string;
    readonly action: string;
    readonly targetType: string;
    readonly targetId: string;
    readonly note?: string | null;
  },
): Promise<void> {
  if (!auditLogService || !input.actorId) {
    return;
  }
  await auditLogService.record({
    actorId: input.actorId,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId,
    note: input.note,
  });
}
