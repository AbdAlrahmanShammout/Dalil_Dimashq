import { Injectable } from '@nestjs/common';

import {
  SiteContactRepository,
  SiteContacts,
} from '@/modules/contact/repository/site-contact.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

@Injectable()
export class SiteContactPrismaRepository extends SiteContactRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async read(): Promise<SiteContacts> {
    const row = await this.prisma.siteContact.findUnique({ where: { id: 'site' } });
    if (!row) {
      return {};
    }
    return {
      whatsapp: row.whatsapp ?? undefined,
      phone: row.phone ?? undefined,
      email: row.email ?? undefined,
      facebook: row.facebook ?? undefined,
      instagram: row.instagram ?? undefined,
    };
  }
}
