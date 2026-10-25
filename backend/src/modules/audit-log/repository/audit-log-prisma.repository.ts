import { Injectable } from '@nestjs/common';

import {
  AuditLogPage,
  AuditLogRepository,
  RecordAuditInput,
} from '@/modules/audit-log/repository/audit-log.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class AuditLogPrismaRepository extends AuditLogRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  override async record(input: RecordAuditInput): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        note: input.note ?? null,
      },
    });
  }

  override async list(limit: number, offset: number): Promise<AuditLogPage> {
    const [rows, total] = await Promise.all([
      this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
      this.prisma.auditLog.count(),
    ]);
    return {
      total,
      items: rows.map((row) => ({
        id: row.id,
        actorId: row.actorId,
        action: row.action,
        targetType: row.targetType,
        targetId: row.targetId,
        note: row.note,
        createdAt: row.createdAt,
      })),
    };
  }
}
