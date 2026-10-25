import { ApiProperty } from '@nestjs/swagger';

import { AreaResponseDto } from '@/modules/area/dto/response/area-response.dto';
import { PlaceType } from '@/modules/place/enum/general.enum';
import { DirectoryItem } from '@/modules/place/directory.service';

class DirectoryItemResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly nameAr: string;

  @ApiProperty()
  readonly nameEn: string;

  @ApiProperty({ enum: PlaceType })
  readonly type: PlaceType;

  @ApiProperty({ type: AreaResponseDto })
  readonly area: AreaResponseDto;

  @ApiProperty({ nullable: true })
  readonly coverUrl: string | null;

  constructor(item: DirectoryItem) {
    this.id = item.id;
    this.nameAr = item.nameAr;
    this.nameEn = item.nameEn;
    this.type = item.type;
    this.area = item.area;
    this.coverUrl = item.coverUrl;
  }
}

export class DirectoryResponseDto {
  @ApiProperty({ type: [DirectoryItemResponseDto] })
  readonly items: DirectoryItemResponseDto[];

  constructor(items: DirectoryItem[]) {
    this.items = items.map((item) => new DirectoryItemResponseDto(item));
  }
}
