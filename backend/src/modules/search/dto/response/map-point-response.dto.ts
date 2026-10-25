import { ApiProperty } from '@nestjs/swagger';

import { PlaceType } from '@/modules/place/enum/general.enum';
import { MapPoint } from '@/modules/search/repository/search.repository';

export class MapPointResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly latitude: number;

  @ApiProperty()
  readonly longitude: number;

  @ApiProperty({ enum: PlaceType })
  readonly type: PlaceType;

  constructor(point: MapPoint) {
    this.id = point.id;
    this.latitude = point.latitude;
    this.longitude = point.longitude;
    this.type = point.type;
  }
}
