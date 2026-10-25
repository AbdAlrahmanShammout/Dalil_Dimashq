import { ApiProperty } from '@nestjs/swagger';

import { NotificationRow } from '@/modules/notification/repository/notification.repository';

class NotificationItemResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly kind: string;

  @ApiProperty({ nullable: true })
  readonly bookingId: string | null;

  @ApiProperty()
  readonly read: boolean;

  @ApiProperty()
  readonly createdAt: string;

  constructor(row: NotificationRow) {
    this.id = row.id;
    this.kind = row.kind;
    this.bookingId = row.bookingId;
    this.read = row.readAt !== null;
    this.createdAt = row.createdAt.toISOString();
  }
}

export class NotificationListResponseDto {
  @ApiProperty({ type: [NotificationItemResponseDto] })
  readonly notifications: NotificationItemResponseDto[];

  constructor(rows: readonly NotificationRow[]) {
    this.notifications = rows.map((row) => new NotificationItemResponseDto(row));
  }
}
