import { ApiProperty } from '@nestjs/swagger';

import { RecentPlaceSummary } from '@/modules/recent-view/repository/recent-place.repository';

class RecentPlaceResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly nameAr: string;

  @ApiProperty()
  readonly nameEn: string;

  @ApiProperty()
  readonly type: string;

  constructor(place: RecentPlaceSummary) {
    this.id = place.id;
    this.nameAr = place.nameAr;
    this.nameEn = place.nameEn;
    this.type = place.type;
  }
}

export class RecentPlaceListResponseDto {
  @ApiProperty({ type: [RecentPlaceResponseDto] })
  readonly places: RecentPlaceResponseDto[];

  constructor(places: readonly RecentPlaceSummary[]) {
    this.places = places.map((place) => new RecentPlaceResponseDto(place));
  }
}
