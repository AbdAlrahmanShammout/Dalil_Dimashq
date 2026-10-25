import { ApiProperty } from '@nestjs/swagger';

import { PlaceShare } from '@/modules/place/place-share.service';

export class PlaceShareResponseDto {
  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty({ nullable: true })
  readonly imageUrl: string | null;

  constructor(share: PlaceShare) {
    this.title = share.title;
    this.description = share.description;
    this.imageUrl = share.imageUrl;
  }
}
