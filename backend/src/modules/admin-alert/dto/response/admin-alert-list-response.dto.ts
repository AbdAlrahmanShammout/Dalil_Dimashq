import { ApiProperty } from '@nestjs/swagger';

import { AdminAlertItem } from '@/modules/admin-alert/repository/admin-alert.repository';

class AdminAlertItemResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly kind: string;

  @ApiProperty()
  readonly message: string;

  @ApiProperty({ nullable: true })
  readonly targetId: string | null;

  @ApiProperty()
  readonly createdAt: Date;

  constructor(item: AdminAlertItem) {
    this.id = item.id;
    this.kind = item.kind;
    this.message = item.message;
    this.targetId = item.targetId;
    this.createdAt = item.createdAt;
  }
}

export class AdminAlertListResponseDto {
  @ApiProperty({ type: [AdminAlertItemResponseDto] })
  readonly alerts: AdminAlertItemResponseDto[];

  constructor(alerts: readonly AdminAlertItem[]) {
    this.alerts = alerts.map((item) => new AdminAlertItemResponseDto(item));
  }
}
