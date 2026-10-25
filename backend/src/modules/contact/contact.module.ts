import { Module } from '@nestjs/common';

import { ContactMessageService } from '@/modules/contact/contact-message.service';
import { ContactMessagePrismaRepository } from '@/modules/contact/repository/contact-message-prisma.repository';
import { ContactMessageRepository } from '@/modules/contact/repository/contact-message.repository';
import { SiteContactPrismaRepository } from '@/modules/contact/repository/site-contact-prisma.repository';
import { SiteContactRepository } from '@/modules/contact/repository/site-contact.repository';
import { SiteContactService } from '@/modules/contact/site-contact.service';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule],
  providers: [
    SiteContactService,
    ContactMessageService,
    { provide: SiteContactRepository, useClass: SiteContactPrismaRepository },
    { provide: ContactMessageRepository, useClass: ContactMessagePrismaRepository },
  ],
  exports: [SiteContactService, ContactMessageService],
})
export class ContactModule {}
