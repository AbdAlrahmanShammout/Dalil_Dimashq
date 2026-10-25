import { ApiProperty } from '@nestjs/swagger';

import { PaymentRecord } from '@/modules/payment/repository/payment.repository';

export class PaymentResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly placeId: string;

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

  @ApiProperty()
  readonly receiptNumber: string;

  constructor(record: PaymentRecord) {
    this.id = record.id;
    this.placeId = record.placeId;
    this.amount = record.amount;
    this.currency = record.currency;
    this.method = record.method;
    this.item = record.item;
    this.payer = record.payer;
    this.periodStart = record.periodStart;
    this.periodEnd = record.periodEnd;
    this.receiptNumber = record.receiptNumber;
  }
}
