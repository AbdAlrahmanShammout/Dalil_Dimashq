import { DeviceService } from '@/modules/device/device.service';
import {
  DeviceRepository,
  RegisterDeviceInput,
} from '@/modules/device/repository/device.repository';

class MemoryDeviceRepository extends DeviceRepository {
  readonly rows: RegisterDeviceInput[] = [];

  async register(input: RegisterDeviceInput): Promise<{ id: string }> {
    this.rows.push(input);
    return { id: 'device-1' };
  }

  async listTokens(): Promise<readonly string[]> {
    return this.rows.map((row) => row.token);
  }
}

describe('DeviceService', () => {
  it('stores the token without sending a push', async () => {
    const repository = new MemoryDeviceRepository();
    const actual = await new DeviceService(repository).register({
      userId: 'user-1',
      audience: 'client-app',
      platform: 'ios',
      token: 'token-1',
    });
    expect(actual.id).toBe('device-1');
    expect(repository.rows).toHaveLength(1);
  });
});
