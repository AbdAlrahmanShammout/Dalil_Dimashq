import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { DatabaseConfigService } from '@/config/database/database-config.service';

@Injectable()
export class PrismaProviderService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(databaseConfigService: DatabaseConfigService) {
    super({ datasources: { db: { url: databaseConfigService.url } } });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
