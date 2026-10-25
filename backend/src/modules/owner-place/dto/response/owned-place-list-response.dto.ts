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

  @ApiProperty()
  readonly premiumActive: boolean;

  @ApiProperty({ nullable: true })
  readonly premiumEndsAt: Date | null;

  @ApiProperty()
  readonly pendingRequestCount: number;

  constructor(place: OwnedPlaceSummary) {
    this.id = place.id;
    this.nameAr = place.nameAr;
    this.nameEn = place.nameEn;
    this.type = place.type;
    this.addressAr = place.addressAr;
    this.addressEn = place.addressEn;
    this.premiumActive = place.premiumActive;
    this.premiumEndsAt = place.premiumEndsAt;
    this.pendingRequestCount = place.pendingRequestCount;
  }
}

export class OwnedPlaceListResponseDto {
  @ApiProperty({ type: [OwnedPlaceResponseDto] })
  readonly places: OwnedPlaceResponseDto[];

  constructor(places: OwnedPlaceSummary[]) {
    this.places = places.map((place) => new OwnedPlaceResponseDto(place));
  }
}
