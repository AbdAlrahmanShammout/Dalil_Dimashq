import { ApiProperty } from '@nestjs/swagger';

import { OwnerLinkRow } from '@/modules/owner-place/repository/place-owner.repository';

class OwnerLinkResponseDto {
  @ApiProperty()
  readonly placeId: string;

  @ApiProperty()
  readonly placeNameEn: string;

  @ApiProperty()
  readonly userId: string;

  @ApiProperty()
  readonly email: string;

  constructor(row: OwnerLinkRow) {
    this.placeId = row.placeId;
    this.placeNameEn = row.placeNameEn;
    this.userId = row.userId;
    this.email = row.email;
  }
}

export class OwnerLinkListResponseDto {
  @ApiProperty({ type: [OwnerLinkResponseDto] })
  readonly links: OwnerLinkResponseDto[];

  constructor(rows: readonly OwnerLinkRow[]) {
    this.links = rows.map((row) => new OwnerLinkResponseDto(row));
  }
}
