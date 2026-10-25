import { ApiProperty } from '@nestjs/swagger';

import { PaymentHistoryItem } from '@/modules/payment/repository/payment.repository';

class PaymentHistoryItemResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly amount: number;

  @ApiProperty()
  readonly currency: string;

  @ApiProperty()
  readonly method: string;

  @ApiProperty()
  readonly item: string;

  @ApiProperty()
  readonly payer: string;

  @ApiProperty()
  readonly receiptNumber: string;

  @ApiProperty({ nullable: true })
  readonly voidedAt: Date | null;

  @ApiProperty({ nullable: true })
  readonly voidReason: string | null;

  @ApiProperty()
  readonly createdAt: Date;

  constructor(item: PaymentHistoryItem) {
    this.id = item.id;
    this.amount = item.amount;
    this.currency = item.currency;
    this.method = item.method;
    this.item = item.item;
    this.payer = item.payer;
    this.receiptNumber = item.receiptNumber;
    this.voidedAt = item.voidedAt;
    this.voidReason = item.voidReason;
    this.createdAt = item.createdAt;
  }
}

export class PaymentHistoryResponseDto {
  @ApiProperty({ type: [PaymentHistoryItemResponseDto] })
  readonly payments: PaymentHistoryItemResponseDto[];

  constructor(items: readonly PaymentHistoryItem[]) {
    this.payments = items.map((item) => new PaymentHistoryItemResponseDto(item));
  }
}
