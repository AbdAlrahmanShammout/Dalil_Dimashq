import { Injectable } from '@nestjs/common';

import { TransactionContext, TransactionRunner } from '@/common/base/transaction-runner';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class PrismaTransactionRunner extends TransactionRunner {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  run<T>(work: (context: TransactionContext) => Promise<T>): Promise<T> {
    return this.prisma.$transaction((transaction) => work(transaction));
  }
}
