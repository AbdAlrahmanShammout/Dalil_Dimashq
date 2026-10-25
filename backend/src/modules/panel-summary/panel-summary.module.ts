import { Module } from '@nestjs/common';

import { AdminAlertModule } from '@/modules/admin-alert/admin-alert.module';
import { ChangeRequestModule } from '@/modules/change-request/change-request.module';
import { FakeReportModule } from '@/modules/fake-report/fake-report.module';
import { PanelSummaryService } from '@/modules/panel-summary/panel-summary.service';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [ChangeRequestModule, UserModule, FakeReportModule, AdminAlertModule],
  providers: [PanelSummaryService],
  exports: [PanelSummaryService],
})
export class PanelSummaryModule {}
