import { DependencyFailureException } from '@/common/exceptions/dependency-failure.exception';
import { HealthService } from '@/health/health.service';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('HealthService', () => {
  it('resolves when the database answers', async () => {
    const prisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    } as unknown as PrismaProviderService;
    const service = new HealthService(prisma);
    await expect(service.assertReady()).resolves.toBeUndefined();
  });

  it('fails when the database does not answer in time', async () => {
    jest.useFakeTimers();
    const prisma = {
      $queryRaw: jest.fn().mockReturnValue(new Promise(() => undefined)),
    } as unknown as PrismaProviderService;
    const service = new HealthService(prisma);
    const pending = service.assertReady();
    jest.advanceTimersByTime(1000);
    await expect(pending).rejects.toBeInstanceOf(DependencyFailureException);
    jest.useRealTimers();
  });
});
