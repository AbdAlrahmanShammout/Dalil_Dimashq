import { Injectable } from '@nestjs/common';

import {
  ContactMessagePage,
  ContactMessageRepository,
  CreateContactMessageInput,
} from '@/modules/contact/repository/contact-message.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class ContactMessagePrismaRepository extends ContactMessageRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async countSince(visitorKey: string, since: Date): Promise<number> {
    return this.prisma.contactMessage.count({
      where: { visitorKey, createdAt: { gte: since } },
    });
  }

  async create(input: CreateContactMessageInput): Promise<{ id: string }> {
    const row = await this.prisma.contactMessage.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        type: input.type,
        message: input.message,
        visitorKey: input.visitorKey,
        createdAt: input.now,
      },
    });
    return { id: row.id };
  }

  override async list(limit: number, offset: number): Promise<ContactMessagePage> {
    const [rows, total] = await Promise.all([
      this.prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.contactMessage.count(),
    ]);
    return {
      total,
      items: rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        type: row.type,
        message: row.message,
        createdAt: row.createdAt,
      })),
    };
  }
}
