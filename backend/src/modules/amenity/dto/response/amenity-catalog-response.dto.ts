import { ApiProperty } from '@nestjs/swagger';

import { AmenityCatalogItem } from '@/modules/amenity/repository/amenity.repository';

class AmenityCatalogItemDto {
  @ApiProperty()
  readonly code: string;

  @ApiProperty()
  readonly nameAr: string;

  @ApiProperty()
  readonly nameEn: string;

  constructor(item: AmenityCatalogItem) {
    this.code = item.code;
    this.nameAr = item.nameAr;
    this.nameEn = item.nameEn;
  }
}

export class AmenityCatalogResponseDto {
  @ApiProperty({ type: [AmenityCatalogItemDto] })
  readonly amenities: AmenityCatalogItemDto[];

  constructor(items: AmenityCatalogItem[]) {
    this.amenities = items.map((item) => new AmenityCatalogItemDto(item));
  }
}
