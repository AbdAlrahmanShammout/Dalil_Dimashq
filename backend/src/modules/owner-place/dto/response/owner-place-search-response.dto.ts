import { ApiProperty } from '@nestjs/swagger';

import { nextPageOffset } from '@/common/pagination';
import { PlaceNamePage } from '@/modules/owner-place/repository/place-owner.repository';

class OwnerPlaceSearchItemDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly nameAr: string;

  @ApiProperty()
  readonly nameEn: string;

  @ApiProperty()
  readonly type: string;

  @ApiProperty({ nullable: true })
  readonly addressAr: string | null;

  @ApiProperty({ nullable: true })
  readonly addressEn: string | null;

  constructor(place: PlaceNamePage['places'][number]) {
    this.id = place.id;
    this.nameAr = place.nameAr;
    this.nameEn = place.nameEn;
    this.type = place.type;
    this.addressAr = place.addressAr;
    this.addressEn = place.addressEn;
  }
}

export class OwnerPlaceSearchResponseDto {
  @ApiProperty({ type: [OwnerPlaceSearchItemDto] })
  readonly places: OwnerPlaceSearchItemDto[];

  @ApiProperty()
  readonly total: number;

  @ApiProperty({ nullable: true })
  readonly nextOffset: number | null;

  constructor(page: PlaceNamePage) {
    this.places = page.places.map((place) => new OwnerPlaceSearchItemDto(place));
    this.total = page.total;
    this.nextOffset = nextPageOffset(page.offset, page.limit, page.total);
  }
}
