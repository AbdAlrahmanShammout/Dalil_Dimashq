import { TransactionRunner } from '@/common/base/transaction-runner';
import { PrismaTransactionRunner } from '@/providers/database/prisma/prisma-transaction-runner';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('PrismaTransactionRunner', () => {
  it('runs the work inside a database transaction', async () => {
    const context = { id: 'transaction' };
    const prisma = {
      $transaction: jest.fn(async (work: (value: unknown) => Promise<string>) => work(context)),
    } as unknown as PrismaProviderService;
    const runner = new PrismaTransactionRunner(prisma);
    const actual = await runner.run(async (received) => {
      expect(received).toBe(context);
      return 'done';
    });
    expect(actual).toBe('done');
  });

  it('is the concrete transaction runner', () => {
    expect(new PrismaTransactionRunner({} as PrismaProviderService)).toBeInstanceOf(
      TransactionRunner,
    );
  });
});
