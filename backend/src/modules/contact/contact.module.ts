import { Module } from '@nestjs/common';

import { ContactMessagePrismaRepository } from '@/modules/contact/repository/contact-message-prisma.repository';
import { ContactMessageRepository } from '@/modules/contact/repository/contact-message.repository';
import { ContactMessageService } from '@/modules/contact/contact-message.service';
import { SuggestionPrismaRepository } from '@/modules/contact/repository/suggestion-prisma.repository';
import { SuggestionRepository } from '@/modules/contact/repository/suggestion.repository';
import { SuggestionService } from '@/modules/contact/suggestion.service';
import { SiteContactPrismaRepository } from '@/modules/contact/repository/site-contact-prisma.repository';
import { SiteContactRepository } from '@/modules/contact/repository/site-contact.repository';
import { SiteContactService } from '@/modules/contact/site-contact.service';
import { AuditLogModule } from '@/modules/audit-log/audit-log.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';

@Module({
  imports: [DatabaseProviderModule, AuditLogModule],
  providers: [
    SiteContactService,
    ContactMessageService,
    SuggestionService,
    { provide: SiteContactRepository, useClass: SiteContactPrismaRepository },
    { provide: ContactMessageRepository, useClass: ContactMessagePrismaRepository },
    { provide: SuggestionRepository, useClass: SuggestionPrismaRepository },
  ],
  exports: [SiteContactService, ContactMessageService, SuggestionService],
})
export class ContactModule {}
