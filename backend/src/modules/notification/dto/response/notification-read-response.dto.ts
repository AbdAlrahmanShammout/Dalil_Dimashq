import { ApiProperty } from '@nestjs/swagger';

import { NotificationRow } from '@/modules/notification/repository/notification.repository';

export class NotificationReadResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly readAt: string;

  constructor(row: NotificationRow) {
    this.id = row.id;
    this.readAt = row.readAt?.toISOString() ?? '';
  }
}
