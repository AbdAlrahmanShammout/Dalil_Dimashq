import { Injectable } from '@nestjs/common';

import { AdminAlertService } from '@/modules/admin-alert/admin-alert.service';
import { FakeReportService } from '@/modules/fake-report/fake-report.service';
import { PlaceChangeService } from '@/modules/change-request/place-change.service';
import { UserService } from '@/modules/user/user.service';

export interface PanelSummary {
  readonly pendingChangeRequests: number;
  readonly pendingProfileChanges: number;
  readonly openFakeReports: number;
  readonly unreadAlerts: number;
}

@Injectable()
export class PanelSummaryService {
  constructor(
    private readonly placeChangeService: PlaceChangeService,
    private readonly userService: UserService,
    private readonly fakeReportService: FakeReportService,
    private readonly adminAlertService: AdminAlertService,
  ) {}

  /**
   * Live counts for the staff home screen.
   */
  async read(): Promise<PanelSummary> {
    const [pendingChangeRequests, pendingProfileChanges, openFakeReports, unreadAlerts] =
      await Promise.all([
        this.placeChangeService.countPending(),
        this.userService.countPendingProfileChanges(),
        this.fakeReportService.countOpen(),
        this.adminAlertService.countUnread(),
      ]);
    return { pendingChangeRequests, pendingProfileChanges, openFakeReports, unreadAlerts };
  }
}
