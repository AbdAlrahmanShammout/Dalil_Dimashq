import { Module } from '@nestjs/common';

import { DeviceService } from '@/modules/device/device.service';
import { DevicePrismaRepository } from '@/modules/device/repository/device-prisma.repository';
import { DeviceRepository } from '@/modules/device/repository/device.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [DeviceService, { provide: DeviceRepository, useClass: DevicePrismaRepository }],
  exports: [DeviceService, DeviceRepository],
})
export class DeviceModule {}
