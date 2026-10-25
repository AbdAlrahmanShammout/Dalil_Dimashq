import { Injectable } from '@nestjs/common';
import { PaymentMethod, Prisma } from '@prisma/client';

import {
  CreatePaymentInput,
  PaymentHistoryItem,
  PaymentRecord,
  PaymentRepository,
} from '@/modules/payment/repository/payment.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class PaymentPrismaRepository extends PaymentRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  override async countReceiptPrefix(prefix: string): Promise<number> {
    return this.prisma.payment.count({ where: { receiptNumber: { startsWith: prefix } } });
  }

  override async create(
    input: CreatePaymentInput,
  ): Promise<PaymentRecord | 'missing_place' | 'duplicate_receipt'> {
    try {
      const row = await this.prisma.payment.create({
        data: {
          placeId: input.placeId,
          amount: input.amount,
          currency: input.currency,
          method: input.method as PaymentMethod,
          item: input.item,
          payer: input.payer,
          periodStart: input.periodStart,
          periodEnd: input.periodEnd,
          receiptNumber: input.receiptNumber,
        },
      });
      return toRecord(row);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        return 'missing_place';
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return 'duplicate_receipt';
      }
      throw error;
    }
  }

  override async voidPayment(
    id: string,
    reason: string,
    voidedAt: Date,
  ): Promise<PaymentRecord | 'missing' | 'already_void'> {
    const existing = await this.prisma.payment.findUnique({ where: { id } });
    if (!existing) {
      return 'missing';
    }
    try {
      await this.prisma.paymentVoid.create({ data: { paymentId: id, reason, voidedAt } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return 'already_void';
      }
      throw error;
    }
    return toRecord(existing);
  }

  override async listByPlace(placeId: string): Promise<PaymentHistoryItem[]> {
    const rows = await this.prisma.payment.findMany({
      where: { placeId },
      include: { void: true },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ({
      ...toRecord(row),
      voidedAt: row.void?.voidedAt ?? null,
      voidReason: row.void?.reason ?? null,
    }));
  }

  override async findById(id: string): Promise<PaymentHistoryItem | null> {
    const row = await this.prisma.payment.findUnique({ where: { id }, include: { void: true } });
    if (!row) {
      return null;
    }
    return {
      ...toRecord(row),
      voidedAt: row.void?.voidedAt ?? null,
      voidReason: row.void?.reason ?? null,
    };
  }
}

function toRecord(row: {
  id: string;
  placeId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  item: string;
  payer: string;
  periodStart: Date | null;
  periodEnd: Date | null;
  receiptNumber: string;
  createdAt: Date;
}): PaymentRecord {
  return {
    id: row.id,
    placeId: row.placeId,
    amount: row.amount,
    currency: row.currency,
    method: row.method,
    item: row.item,
    payer: row.payer,
    periodStart: row.periodStart,
    periodEnd: row.periodEnd,
    receiptNumber: row.receiptNumber,
    createdAt: row.createdAt,
  };
}
