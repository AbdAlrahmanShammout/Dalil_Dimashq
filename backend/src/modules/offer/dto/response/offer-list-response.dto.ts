import { ApiProperty } from '@nestjs/swagger';

import { OfferView, OfferViewPage } from '@/modules/offer/offer.service';

class OfferResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly placeId: string;

  @ApiProperty()
  readonly titleAr: string;

  @ApiProperty()
  readonly titleEn: string;

  @ApiProperty()
  readonly detailsAr: string;

  @ApiProperty()
  readonly detailsEn: string;

  @ApiProperty({ nullable: true })
  readonly imageUrl: string | null;

  @ApiProperty()
  readonly until: Date;

  constructor(offer: OfferView) {
    this.id = offer.id;
    this.placeId = offer.placeId;
    this.titleAr = offer.titleAr;
    this.titleEn = offer.titleEn;
    this.detailsAr = offer.detailsAr;
    this.detailsEn = offer.detailsEn;
    this.imageUrl = offer.imageUrl;
    this.until = offer.until;
  }
}

export class OfferListResponseDto {
  @ApiProperty({ type: [OfferResponseDto] })
  readonly items: OfferResponseDto[];

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly offset: number;

  constructor(page: OfferViewPage) {
    this.items = page.items.map((offer) => new OfferResponseDto(offer));
    this.total = page.total;
    this.limit = page.limit;
    this.offset = page.offset;
  }
}
