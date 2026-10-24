import { Injectable } from '@nestjs/common';

import { DependencyFailureException } from '@/common/exceptions/dependency-failure.exception';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

const HEALTH_READY_TIMEOUT_MS = 1000;

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaProviderService) {}

  /**
   * Confirms the database answers within a short timeout.
   * Optional integrations are not checked.
   */
  async assertReady(): Promise<void> {
    let timer: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => {
        reject(
          new DependencyFailureException({
            message: 'Database timed out',
            code: 'dependency_failure',
          }),
        );
      }, HEALTH_READY_TIMEOUT_MS);
    });
    try {
      await Promise.race([this.prisma.$queryRaw`SELECT 1`, timeout]);
    } finally {
      if (timer) {
        clearTimeout(timer);
      }
    }
  }
}
