import { Module } from '@nestjs/common';

import { PaymentPrismaRepository } from '@/modules/payment/repository/payment-prisma.repository';
import { PaymentRepository } from '@/modules/payment/repository/payment.repository';
import { PaymentService } from '@/modules/payment/payment.service';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [PaymentService, { provide: PaymentRepository, useClass: PaymentPrismaRepository }],
  exports: [PaymentService],
})
export class PaymentModule {}
