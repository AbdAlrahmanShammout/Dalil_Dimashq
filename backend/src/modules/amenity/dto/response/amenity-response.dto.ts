import { ApiProperty } from '@nestjs/swagger';

import { PlaceAmenityEntity } from '@/modules/amenity/entity/place-amenity.entity';

export class AmenityResponseDto {
  @ApiProperty()
  readonly code: string;

  @ApiProperty()
  readonly nameAr: string;

  @ApiProperty()
  readonly nameEn: string;

  constructor(amenity: PlaceAmenityEntity) {
    this.code = amenity.code;
    this.nameAr = amenity.nameAr;
    this.nameEn = amenity.nameEn;
  }
}
