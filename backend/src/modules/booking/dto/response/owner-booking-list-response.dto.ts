import { ApiProperty } from '@nestjs/swagger';

import { OwnerBookingRow } from '@/modules/booking/repository/booking.repository';

export class OwnerBookingItemResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty({ nullable: true })
  readonly phone: string | null;

  @ApiProperty()
  readonly partySize: number;

  @ApiProperty()
  readonly startsAt: string;

  @ApiProperty({ nullable: true })
  readonly note: string | null;

  @ApiProperty()
  readonly status: string;

  @ApiProperty()
  readonly reported: boolean;

  constructor(row: OwnerBookingRow) {
    this.id = row.id;
    this.name = row.name;
    this.phone = row.phone;
    this.partySize = row.partySize;
    this.startsAt = row.startsAt.toISOString();
    this.note = row.note;
    this.status = row.status;
    this.reported = row.reported;
  }
}

export class OwnerBookingListResponseDto {
  @ApiProperty({ type: [OwnerBookingItemResponseDto] })
  readonly items: OwnerBookingItemResponseDto[];

  constructor(rows: readonly OwnerBookingRow[]) {
    this.items = rows.map((row) => new OwnerBookingItemResponseDto(row));
  }
}
