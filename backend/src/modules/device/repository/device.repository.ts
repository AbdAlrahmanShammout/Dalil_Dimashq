export const DEVICE_PLATFORMS = ['android', 'ios', 'web'] as const;

export type DevicePlatformName = (typeof DEVICE_PLATFORMS)[number];

export interface RegisterDeviceInput {
  readonly userId: string;
  readonly audience: string;
  readonly platform: DevicePlatformName;
  readonly token: string;
}

export abstract class DeviceRepository {
  abstract register(input: RegisterDeviceInput): Promise<{ id: string }>;
  abstract listTokens(userId: string): Promise<readonly string[]>;
}
