export const PAYMENT_METHODS = [
  'cash',
  'syriatel_cash',
  'mtn_cash',
  'bank_transfer',
  'other',
] as const;

export type PaymentMethodName = (typeof PAYMENT_METHODS)[number];

export interface PaymentRecord {
  readonly id: string;
  readonly placeId: string;
  readonly amount: number;
  readonly currency: string;
  readonly method: PaymentMethodName;
  readonly item: string;
  readonly payer: string;
  readonly periodStart: Date | null;
  readonly periodEnd: Date | null;
  readonly receiptNumber: string;
  readonly createdAt: Date;
}

export interface PaymentHistoryItem extends PaymentRecord {
  readonly voidedAt: Date | null;
  readonly voidReason: string | null;
}

export interface CreatePaymentInput {
  readonly placeId: string;
  readonly amount: number;
  readonly currency: string;
  readonly method: PaymentMethodName;
  readonly item: string;
  readonly payer: string;
  readonly periodStart: Date | null;
  readonly periodEnd: Date | null;
  readonly receiptNumber: string;
}

export abstract class PaymentRepository {
  countReceiptPrefix(_prefix: string): Promise<number> {
    return Promise.resolve(0);
  }

  create(
    _input: CreatePaymentInput,
  ): Promise<PaymentRecord | 'missing_place' | 'duplicate_receipt'> {
    return Promise.resolve('missing_place');
  }

  voidPayment(
    _id: string,
    _reason: string,
    _voidedAt: Date,
  ): Promise<PaymentRecord | 'missing' | 'already_void'> {
    return Promise.resolve('missing');
  }

  listByPlace(_placeId: string): Promise<PaymentHistoryItem[]> {
    return Promise.resolve([]);
  }

  findById(_id: string): Promise<PaymentHistoryItem | null> {
    return Promise.resolve(null);
  }
}
