import { ApiProperty } from '@nestjs/swagger';

import { PlaceCounts } from '@/modules/place/repository/place.repository';

export class PlaceCountsResponseDto {
  @ApiProperty()
  readonly all: number;

  @ApiProperty()
  readonly hotels: number;

  @ApiProperty()
  readonly restaurants: number;

  @ApiProperty()
  readonly cafes: number;

  constructor(counts: PlaceCounts) {
    this.all = counts.all;
    this.hotels = counts.hotels;
    this.restaurants = counts.restaurants;
    this.cafes = counts.cafes;
  }
}
