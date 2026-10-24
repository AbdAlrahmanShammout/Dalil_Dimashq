import { Module } from '@nestjs/common';

import { SchedulerManagerService } from '@/providers/scheduler/scheduler-manager.service';

@Module({
  providers: [SchedulerManagerService],
  exports: [SchedulerManagerService],
})
export class SchedulerProviderModule {}
