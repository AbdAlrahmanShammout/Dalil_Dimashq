import { ApiProperty } from '@nestjs/swagger';

import { nextPageOffset } from '@/common/pagination';
import { EventView } from '@/modules/event/event.service';

export class EventResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly titleAr: string;

  @ApiProperty()
  readonly titleEn: string;

  @ApiProperty()
  readonly descriptionAr: string;

  @ApiProperty()
  readonly descriptionEn: string;

  @ApiProperty({ nullable: true })
  readonly addressAr: string | null;

  @ApiProperty({ nullable: true })
  readonly addressEn: string | null;

  @ApiProperty({ nullable: true })
  readonly phone: string | null;

  @ApiProperty({ nullable: true })
  readonly posterUrl: string | null;

  @ApiProperty()
  readonly startsAt: Date;

  @ApiProperty({ nullable: true })
  readonly placeId: string | null;

  constructor(event: EventView) {
    this.id = event.id;
    this.titleAr = event.titleAr;
    this.titleEn = event.titleEn;
    this.descriptionAr = event.descriptionAr;
    this.descriptionEn = event.descriptionEn;
    this.addressAr = event.addressAr;
    this.addressEn = event.addressEn;
    this.phone = event.phone;
    this.posterUrl = event.posterUrl;
    this.startsAt = event.startsAt;
    this.placeId = event.placeId;
  }
}

export class EventListResponseDto {
  @ApiProperty({ type: [EventResponseDto] })
  readonly items: EventResponseDto[];

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly offset: number;

  @ApiProperty({ nullable: true })
  readonly nextOffset: number | null;

  constructor(page: { items: EventView[]; total: number; limit: number; offset: number }) {
    this.items = page.items.map((event) => new EventResponseDto(event));
    this.total = page.total;
    this.limit = page.limit;
    this.offset = page.offset;
    this.nextOffset = nextPageOffset(page.offset, page.limit, page.total);
  }
}
