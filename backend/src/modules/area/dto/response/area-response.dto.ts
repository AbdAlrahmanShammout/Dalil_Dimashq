import { ApiProperty } from '@nestjs/swagger';

import { AreaEntity } from '@/modules/area/entity/area.entity';

export class AreaResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly nameAr: string;

  @ApiProperty()
  readonly nameEn: string;

  constructor(area: AreaEntity) {
    this.id = area.id;
    this.nameAr = area.nameAr;
    this.nameEn = area.nameEn;
  }
}
