import { ApiProperty } from '@nestjs/swagger';

import { SubscriptionRecord } from '@/modules/subscription/repository/subscription.repository';

export class SubscriptionResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly placeId: string;

  @ApiProperty()
  readonly endsAt: Date;

  constructor(record: SubscriptionRecord) {
    this.id = record.id;
    this.placeId = record.placeId;
    this.endsAt = record.endsAt;
  }
}
