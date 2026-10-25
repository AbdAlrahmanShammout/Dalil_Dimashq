import { ApiProperty } from '@nestjs/swagger';

import {
  PlaceChangeKindName,
  PlaceChangeRecord,
  PlaceChangeStatusName,
} from '@/modules/change-request/repository/place-change.repository';

class PlaceChangeListItemDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly kind: PlaceChangeKindName;

  @ApiProperty()
  readonly status: PlaceChangeStatusName;

  @ApiProperty()
  readonly displayStatus: 'pending' | 'accepted' | 'rejected';

  @ApiProperty({ nullable: true })
  readonly decisionNote: string | null;

  constructor(record: PlaceChangeRecord) {
    this.id = record.id;
    this.kind = record.kind;
    this.status = record.status;
    this.displayStatus = record.status === 'approved' ? 'accepted' : record.status;
    this.decisionNote = record.decisionNote;
  }
}

export class PlaceChangeListResponseDto {
  @ApiProperty({ type: [PlaceChangeListItemDto] })
  readonly requests: PlaceChangeListItemDto[];

  constructor(records: PlaceChangeRecord[]) {
    this.requests = records.map((record) => new PlaceChangeListItemDto(record));
  }
}
