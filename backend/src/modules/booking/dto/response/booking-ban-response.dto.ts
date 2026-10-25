import { ApiProperty } from '@nestjs/swagger';

import { BanExplanation } from '@/modules/booking/booking-ban';

export class BookingBanResponseDto {
  @ApiProperty()
  readonly active: boolean;

  @ApiProperty()
  readonly kind: string;

  @ApiProperty({ nullable: true })
  readonly level: number | null;

  @ApiProperty({ nullable: true })
  readonly endsAt: string | null;

  constructor(ban: BanExplanation) {
    this.active = ban.active;
    this.kind = ban.kind;
    this.level = ban.level;
    this.endsAt = ban.endsAt ? ban.endsAt.toISOString() : null;
  }
}
