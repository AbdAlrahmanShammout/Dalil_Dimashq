import { ApiProperty } from '@nestjs/swagger';

import { NoShowWatchRow } from '@/modules/booking/repository/booking.repository';

class NoShowWatchItemResponseDto {
  @ApiProperty()
  readonly userId: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly count: number;

  constructor(row: NoShowWatchRow) {
    this.userId = row.userId;
    this.email = row.email;
    this.count = row.count;
  }
}

export class NoShowWatchResponseDto {
  @ApiProperty({ type: [NoShowWatchItemResponseDto] })
  readonly customers: NoShowWatchItemResponseDto[];

  constructor(rows: readonly NoShowWatchRow[]) {
    this.customers = rows.map((row) => new NoShowWatchItemResponseDto(row));
  }
}
