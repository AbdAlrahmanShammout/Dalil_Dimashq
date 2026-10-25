import { Injectable } from '@nestjs/common';

import {
  DeviceRepository,
  RegisterDeviceInput,
} from '@/modules/device/repository/device.repository';

@Injectable()
export class DeviceService {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  /**
   * Stores a Firebase token. This route does not send a push.
   */
  async register(input: RegisterDeviceInput): Promise<{ id: string }> {
    return this.deviceRepository.register(input);
  }
}
