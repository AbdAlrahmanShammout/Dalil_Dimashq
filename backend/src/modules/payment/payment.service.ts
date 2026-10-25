import { Injectable } from '@nestjs/common';

import { ConflictException } from '@/common/exceptions/conflict.exception';
import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import {
  PAYMENT_METHODS,
  PaymentMethodName,
  PaymentHistoryItem,
  PaymentRecord,
  PaymentRepository,
} from '@/modules/payment/repository/payment.repository';

const DAMASCUS_OFFSET_MS = 3 * 60 * 60 * 1000;
const RECEIPT_ATTEMPTS = 5;

export interface RecordPaymentInput {
  readonly placeId: string;
  readonly amount: number;
  readonly currency: string;
  readonly method: string;
  readonly item: string;
  readonly payer: string;
  readonly periodStart: Date | null;
  readonly periodEnd: Date | null;
  readonly now?: Date;
}

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  /**
   * Records a staff payment and issues the receipt number. The client cannot choose it.
   */
  async record(input: RecordPaymentInput): Promise<PaymentRecord> {
    if (!PAYMENT_METHODS.includes(input.method as PaymentMethodName)) {
      throw new InvalidStateException({ message: 'Method is invalid', code: 'kind_invalid' });
    }
    if (input.amount <= 0) {
      throw new InvalidStateException({ message: 'Amount is invalid', code: 'invalid_state' });
    }
    const now = input.now ?? new Date();
    const prefix = receiptPrefix(now);
    for (let attempt = 0; attempt < RECEIPT_ATTEMPTS; attempt += 1) {
      const taken = await this.paymentRepository.countReceiptPrefix(prefix);
      const receiptNumber = `${prefix}${String(taken + 1 + attempt).padStart(4, '0')}`;
      const created = await this.paymentRepository.create({
        placeId: input.placeId,
        amount: input.amount,
        currency: input.currency.trim(),
        method: input.method as PaymentMethodName,
        item: input.item.trim(),
        payer: input.payer.trim(),
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        receiptNumber,
      });
      if (created === 'missing_place') {
        throw new ResourceNotFoundException('Place', input.placeId);
      }
      if (created === 'duplicate_receipt') {
        continue;
      }
      return created;
    }
    throw new ConflictException({ message: 'Receipt number collided', code: 'conflict' });
  }

  /**
   * Records a void beside the payment. The payment row itself stays unchanged.
   */
  async voidPayment(id: string, reason: string, now: Date = new Date()): Promise<PaymentRecord> {
    const trimmed = reason.trim();
    if (!trimmed) {
      throw new InvalidStateException({ message: 'Reason is required', code: 'reason' });
    }
    const saved = await this.paymentRepository.voidPayment(id, trimmed, now);
    if (saved === 'missing') {
      throw new ResourceNotFoundException('Payment', id);
    }
    if (saved === 'already_void') {
      throw new InvalidStateException({ message: 'Already voided', code: 'invalid_state' });
    }
    return saved;
  }

  /**
   * Every payment for a place, including voided ones. Newest first.
   */
  async listForPlace(placeId: string): Promise<PaymentHistoryItem[]> {
    return this.paymentRepository.listByPlace(placeId);
  }

  /**
   * Receipt fields for one payment, including a void when one was recorded.
   */
  async readReceipt(id: string): Promise<PaymentHistoryItem> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new ResourceNotFoundException('Payment', id);
    }
    return payment;
  }
}

function receiptPrefix(now: Date): string {
  const shifted = new Date(now.getTime() + DAMASCUS_OFFSET_MS);
  const year = String(shifted.getUTCFullYear() % 100).padStart(2, '0');
  const month = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  return `DD-${year}-${month}-`;
}
