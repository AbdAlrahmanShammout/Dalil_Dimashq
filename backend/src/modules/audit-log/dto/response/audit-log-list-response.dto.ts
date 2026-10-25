import { ApiProperty } from '@nestjs/swagger';

import { AuditLogItem } from '@/modules/audit-log/repository/audit-log.repository';

class AuditLogItemResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly actorId: string;

  @ApiProperty()
  readonly action: string;

  @ApiProperty()
  readonly targetType: string;

  @ApiProperty()
  readonly targetId: string;

  @ApiProperty({ nullable: true })
  readonly note: string | null;

  @ApiProperty()
  readonly createdAt: Date;

  constructor(item: AuditLogItem) {
    this.id = item.id;
    this.actorId = item.actorId;
    this.action = item.action;
    this.targetType = item.targetType;
    this.targetId = item.targetId;
    this.note = item.note;
    this.createdAt = item.createdAt;
  }
}

export class AuditLogListResponseDto {
  @ApiProperty({ type: [AuditLogItemResponseDto] })
  readonly entries: AuditLogItemResponseDto[];

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly offset: number;

  constructor(page: {
    items: readonly AuditLogItem[];
    total: number;
    limit: number;
    offset: number;
  }) {
    this.entries = page.items.map((item) => new AuditLogItemResponseDto(item));
    this.total = page.total;
    this.limit = page.limit;
    this.offset = page.offset;
  }
}
