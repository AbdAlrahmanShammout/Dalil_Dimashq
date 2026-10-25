import { ApiProperty } from '@nestjs/swagger';

import {
  PlaceChangeKindName,
  PlaceChangeRecord,
  PlaceChangeStatusName,
} from '@/modules/change-request/repository/place-change.repository';

export class PlaceChangeResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly kind: PlaceChangeKindName;

  @ApiProperty()
  readonly status: PlaceChangeStatusName;

  constructor(record: PlaceChangeRecord) {
    this.id = record.id;
    this.kind = record.kind;
    this.status = record.status;
  }
}
