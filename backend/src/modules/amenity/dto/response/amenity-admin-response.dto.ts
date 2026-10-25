import { ApiProperty } from '@nestjs/swagger';

import { AmenityCatalogItem } from '@/modules/amenity/repository/amenity.repository';

export class AmenityAdminResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly code: string;

  @ApiProperty()
  readonly nameAr: string;

  @ApiProperty()
  readonly nameEn: string;

  @ApiProperty()
  readonly sortOrder: number;

  constructor(item: AmenityCatalogItem) {
    this.id = item.id;
    this.code = item.code;
    this.nameAr = item.nameAr;
    this.nameEn = item.nameEn;
    this.sortOrder = item.sortOrder;
  }
}
