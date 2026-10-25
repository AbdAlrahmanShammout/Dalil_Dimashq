import { Module } from '@nestjs/common';

import { SiteContactPrismaRepository } from '@/modules/contact/repository/site-contact-prisma.repository';
import { SiteContactRepository } from '@/modules/contact/repository/site-contact.repository';
import { SiteContactService } from '@/modules/contact/site-contact.service';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [
    SiteContactService,
    { provide: SiteContactRepository, useClass: SiteContactPrismaRepository },
  ],
  exports: [SiteContactService],
})
export class ContactModule {}
