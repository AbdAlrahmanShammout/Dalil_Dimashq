import { Module } from '@nestjs/common';

import { UserRepository } from '@/modules/user/repository/user.repository';
import { UserPrismaRepository } from '@/modules/user/repository/user-prisma.repository';
import { UserService } from '@/modules/user/user.service';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';
import { SmsProviderModule } from '@/providers/sms/sms-provider.module';

@Module({
  imports: [DatabaseProviderModule, SmsProviderModule],
  providers: [UserService, { provide: UserRepository, useClass: UserPrismaRepository }],
  exports: [UserService],
})
export class UserModule {}
