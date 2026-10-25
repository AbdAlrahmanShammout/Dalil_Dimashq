import { ApiProperty } from '@nestjs/swagger';

import { OwnedPlaceSummary } from '@/modules/owner-place/repository/place-owner.repository';

class OwnedPlaceResponseDto {
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

  constructor(place: OwnedPlaceSummary) {
    this.id = place.id;
    this.nameAr = place.nameAr;
    this.nameEn = place.nameEn;
    this.type = place.type;
    this.addressAr = place.addressAr;
    this.addressEn = place.addressEn;
  }
}

export class OwnedPlaceListResponseDto {
  @ApiProperty({ type: [OwnedPlaceResponseDto] })
  readonly places: OwnedPlaceResponseDto[];

  constructor(places: OwnedPlaceSummary[]) {
    this.places = places.map((place) => new OwnedPlaceResponseDto(place));
  }
}
