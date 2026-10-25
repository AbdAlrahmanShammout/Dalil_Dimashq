export interface RecordAuditInput {
  readonly actorId: string;
  readonly action: string;
  readonly targetType: string;
  readonly targetId: string;
  readonly note?: string | null;
}

export interface AuditLogItem {
  readonly id: string;
  readonly actorId: string;
  readonly action: string;
  readonly targetType: string;
  readonly targetId: string;
  readonly note: string | null;
  readonly createdAt: Date;
}

export interface AuditLogPage {
  readonly items: AuditLogItem[];
  readonly total: number;
}

export abstract class AuditLogRepository {
  record(_input: RecordAuditInput): Promise<void> {
    return Promise.resolve();
  }

  list(_limit: number, _offset: number): Promise<AuditLogPage> {
    return Promise.resolve({ items: [], total: 0 });
  }
}
