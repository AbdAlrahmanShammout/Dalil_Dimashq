import { ApiProperty } from '@nestjs/swagger';

import { PanelSummary } from '@/modules/panel-summary/panel-summary.service';

export class PanelSummaryResponseDto {
  @ApiProperty()
  readonly pendingChangeRequests: number;

  @ApiProperty()
  readonly pendingProfileChanges: number;

  @ApiProperty()
  readonly openFakeReports: number;

  @ApiProperty()
  readonly unreadAlerts: number;

  constructor(summary: PanelSummary) {
    this.pendingChangeRequests = summary.pendingChangeRequests;
    this.pendingProfileChanges = summary.pendingProfileChanges;
    this.openFakeReports = summary.openFakeReports;
    this.unreadAlerts = summary.unreadAlerts;
  }
}
