import { Injectable } from '@nestjs/common';

import { NotificationKind } from '@prisma/client';

import {
  NotificationRepository,
  NotificationRow,
  OWNER_NOTIFICATION_KINDS,
  RecordNotificationInput,
} from '@/modules/notification/repository/notification.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class NotificationPrismaRepository extends NotificationRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async listForUser(userId: string): Promise<NotificationRow[]> {
    const rows = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.toRow(row));
  }

  async markRead(
    userId: string,
    notificationId: string,
    readAt: Date,
  ): Promise<NotificationRow | null> {
    const existing = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });
    if (!existing) {
      return null;
    }
    if (existing.readAt) {
      return this.toRow(existing);
    }
    const row = await this.prisma.notification.update({
      where: { id: existing.id },
      data: { readAt },
    });
    return this.toRow(row);
  }

  async record(input: RecordNotificationInput): Promise<NotificationRow> {
    const row = await this.prisma.notification.create({
      data: {
        userId: input.userId,
        kind: input.kind,
        bookingId: input.bookingId,
        createdAt: input.createdAt,
      },
    });
    return this.toRow(row);
  }

  override async listForOwner(userId: string): Promise<NotificationRow[]> {
    const rows = await this.prisma.notification.findMany({
      where: { userId, kind: { in: [...OWNER_NOTIFICATION_KINDS] as NotificationKind[] } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.toRow(row));
  }

  private toRow(row: {
    id: string;
    kind: string;
    bookingId: string | null;
    readAt: Date | null;
    createdAt: Date;
  }): NotificationRow {
    return {
      id: row.id,
      kind: row.kind,
      bookingId: row.bookingId,
      readAt: row.readAt,
      createdAt: row.createdAt,
    };
  }
}
