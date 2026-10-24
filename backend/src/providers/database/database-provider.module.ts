import { Module } from '@nestjs/common';

import { PrismaProviderModule } from '@/providers/database/prisma/prisma-provider.module';

@Module({
  imports: [PrismaProviderModule],
  exports: [PrismaProviderModule],
})
export class DatabaseProviderModule {}
