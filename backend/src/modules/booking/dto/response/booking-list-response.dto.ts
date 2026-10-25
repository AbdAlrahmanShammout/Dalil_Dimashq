import { ApiProperty } from '@nestjs/swagger';

import { nextPageOffset } from '@/common/pagination';
import { BookingListItem } from '@/modules/booking/repository/booking.repository';

class BookingListItemResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly number: number;

  @ApiProperty()
  readonly placeId: string;

  @ApiProperty()
  readonly startsAt: string;

  @ApiProperty()
  readonly partySize: number;

  @ApiProperty()
  readonly status: string;

  constructor(item: BookingListItem) {
    this.id = item.id;
    this.number = item.number;
    this.placeId = item.placeId;
    this.startsAt = item.startsAt.toISOString();
    this.partySize = item.partySize;
    this.status = item.status;
  }
}

export class BookingListResponseDto {
  @ApiProperty({ type: [BookingListItemResponseDto] })
  readonly bookings: BookingListItemResponseDto[];

  @ApiProperty()
  readonly total: number;

  @ApiProperty({ nullable: true })
  readonly nextOffset: number | null;

  constructor(input: { rows: BookingListItem[]; total: number; limit: number; offset: number }) {
    this.bookings = input.rows.map((row) => new BookingListItemResponseDto(row));
    this.total = input.total;
    this.nextOffset = nextPageOffset(input.offset, input.limit, input.total);
  }
}
