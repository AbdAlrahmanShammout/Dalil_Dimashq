import { Injectable } from '@nestjs/common';

import {
  DeviceRepository,
  RegisterDeviceInput,
} from '@/modules/device/repository/device.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class DevicePrismaRepository extends DeviceRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async register(input: RegisterDeviceInput): Promise<{ id: string }> {
    const row = await this.prisma.device.upsert({
      where: {
        userId_audience_token: {
          userId: input.userId,
          audience: input.audience,
          token: input.token,
        },
      },
      update: { platform: input.platform },
      create: input,
    });
    return { id: row.id };
  }

  async listTokens(userId: string): Promise<readonly string[]> {
    const rows = await this.prisma.device.findMany({ where: { userId } });
    return rows.map((row) => row.token);
  }
}
