import { ApiProperty } from '@nestjs/swagger';

import { PaymentHistoryItem } from '@/modules/payment/repository/payment.repository';

export class PaymentReceiptResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly placeId: string;

  @ApiProperty()
  readonly receiptNumber: string;

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

  @ApiProperty({ nullable: true })
  readonly periodStart: Date | null;

  @ApiProperty({ nullable: true })
  readonly periodEnd: Date | null;

  @ApiProperty({ nullable: true })
  readonly voidedAt: Date | null;

  @ApiProperty({ nullable: true })
  readonly voidReason: string | null;

  @ApiProperty()
  readonly createdAt: Date;

  constructor(item: PaymentHistoryItem) {
    this.id = item.id;
    this.placeId = item.placeId;
    this.receiptNumber = item.receiptNumber;
    this.amount = item.amount;
    this.currency = item.currency;
    this.method = item.method;
    this.item = item.item;
    this.payer = item.payer;
    this.periodStart = item.periodStart;
    this.periodEnd = item.periodEnd;
    this.voidedAt = item.voidedAt;
    this.voidReason = item.voidReason;
    this.createdAt = item.createdAt;
  }
}
