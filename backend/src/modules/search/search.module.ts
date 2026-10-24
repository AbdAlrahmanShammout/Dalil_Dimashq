import { Module } from '@nestjs/common';

import { SearchPrismaRepository } from '@/modules/search/repository/search-prisma.repository';
import { SearchRepository } from '@/modules/search/repository/search.repository';
import { SearchService } from '@/modules/search/search.service';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [SearchService, { provide: SearchRepository, useClass: SearchPrismaRepository }],
  exports: [SearchService],
})
export class SearchModule {}
