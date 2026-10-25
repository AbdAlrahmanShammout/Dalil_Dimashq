import { Module } from '@nestjs/common';

import { PaymentPrismaRepository } from '@/modules/payment/repository/payment-prisma.repository';
import { PaymentRepository } from '@/modules/payment/repository/payment.repository';
import { PaymentService } from '@/modules/payment/payment.service';
import { AuditLogModule } from '@/modules/audit-log/audit-log.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, AuditLogModule],
  providers: [PaymentService, { provide: PaymentRepository, useClass: PaymentPrismaRepository }],
  exports: [PaymentService],
})
export class PaymentModule {}
