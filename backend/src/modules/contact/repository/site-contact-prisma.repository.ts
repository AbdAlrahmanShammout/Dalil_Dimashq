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

  override async save(input: SiteContacts): Promise<SiteContacts> {
    const row = await this.prisma.siteContact.upsert({
      where: { id: 'site' },
      create: {
        id: 'site',
        whatsapp: input.whatsapp ?? null,
        phone: input.phone ?? null,
        email: input.email ?? null,
        facebook: input.facebook ?? null,
        instagram: input.instagram ?? null,
      },
      update: {
        whatsapp: input.whatsapp ?? null,
        phone: input.phone ?? null,
        email: input.email ?? null,
        facebook: input.facebook ?? null,
        instagram: input.instagram ?? null,
      },
    });
    return {
      whatsapp: row.whatsapp ?? undefined,
      phone: row.phone ?? undefined,
      email: row.email ?? undefined,
      facebook: row.facebook ?? undefined,
      instagram: row.instagram ?? undefined,
    };
  }
}
