import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BookingDetail } from '@/modules/booking/repository/booking.repository';

class BookingPlaceResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly nameAr: string;

  @ApiProperty()
  readonly nameEn: string;

  constructor(place: BookingDetail['place']) {
    this.id = place.id;
    this.nameAr = place.nameAr;
    this.nameEn = place.nameEn;
  }
}

export class BookingDetailResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly number: number;

  @ApiProperty()
  readonly status: string;

  @ApiProperty()
  readonly place: BookingPlaceResponseDto;

  @ApiProperty()
  readonly startsAt: string;

  @ApiProperty()
  readonly partySize: number;

  @ApiPropertyOptional()
  readonly note: string | null;

  @ApiPropertyOptional()
  readonly rejectionReason: string | null;

  @ApiPropertyOptional()
  readonly cancellationReason: string | null;

  constructor(booking: BookingDetail) {
    this.id = booking.id;
    this.number = booking.number;
    this.status = booking.status;
    this.place = new BookingPlaceResponseDto(booking.place);
    this.startsAt = booking.startsAt.toISOString();
    this.partySize = booking.partySize;
    this.note = booking.note;
    this.rejectionReason = booking.rejectionReason;
    this.cancellationReason = booking.cancellationReason;
  }
}
