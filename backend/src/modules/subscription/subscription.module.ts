import { Module } from '@nestjs/common';

import { SubscriptionPrismaRepository } from '@/modules/subscription/repository/subscription-prisma.repository';
import { SubscriptionRepository } from '@/modules/subscription/repository/subscription.repository';
import { SubscriptionService } from '@/modules/subscription/subscription.service';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [
    SubscriptionService,
    { provide: SubscriptionRepository, useClass: SubscriptionPrismaRepository },
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
