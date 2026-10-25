import { ApiProperty } from '@nestjs/swagger';

import { OwnerPlaceDetail } from '@/modules/owner-place/repository/place-owner.repository';

export class OwnerPlaceDetailResponseDto {
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

  constructor(place: OwnerPlaceDetail) {
    this.id = place.id;
    this.nameAr = place.nameAr;
    this.nameEn = place.nameEn;
    this.type = place.type;
    this.addressAr = place.addressAr;
    this.addressEn = place.addressEn;
  }
}
