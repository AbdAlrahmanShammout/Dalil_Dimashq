import { Injectable } from '@nestjs/common';

import {
  AdminAlertItem,
  AdminAlertRepository,
} from '@/modules/admin-alert/repository/admin-alert.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class AdminAlertPrismaRepository extends AdminAlertRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  override async listUnread(): Promise<AdminAlertItem[]> {
    const rows = await this.prisma.adminAlert.findMany({
      where: { readAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ({
      id: row.id,
      kind: row.kind,
      message: row.message,
      targetId: row.targetId,
      createdAt: row.createdAt,
    }));
  }

  override async markRead(id: string, readAt: Date): Promise<'missing' | 'read' | 'saved'> {
    const existing = await this.prisma.adminAlert.findUnique({ where: { id } });
    if (!existing) {
      return 'missing';
    }
    if (existing.readAt) {
      return 'read';
    }
    await this.prisma.adminAlert.update({ where: { id }, data: { readAt } });
    return 'saved';
  }

  override async countUnread(): Promise<number> {
    return this.prisma.adminAlert.count({ where: { readAt: null } });
  }
}
