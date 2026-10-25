import { ApiProperty } from '@nestjs/swagger';

import { FavoritePlace } from '@/modules/favorite/repository/favorite.repository';

class FavoritePlaceResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly nameAr: string;

  @ApiProperty()
  readonly nameEn: string;

  @ApiProperty()
  readonly type: string;

  constructor(place: FavoritePlace) {
    this.id = place.id;
    this.nameAr = place.nameAr;
    this.nameEn = place.nameEn;
    this.type = place.type;
  }
}

export class FavoriteListResponseDto {
  @ApiProperty({ type: [FavoritePlaceResponseDto] })
  readonly favorites: FavoritePlaceResponseDto[];

  constructor(places: readonly FavoritePlace[]) {
    this.favorites = places.map((place) => new FavoritePlaceResponseDto(place));
  }
}
