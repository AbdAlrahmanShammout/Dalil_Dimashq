import { Injectable } from '@nestjs/common';

import {
  SiteContactRepository,
  SiteContacts,
} from '@/modules/contact/repository/site-contact.repository';

@Injectable()
export class SiteContactService {
  constructor(private readonly siteContactRepository: SiteContactRepository) {}

  /**
   * Public shortcuts. Empty values are omitted.
   */
  async readShortcuts(): Promise<SiteContacts> {
    return this.siteContactRepository.read();
  }

  /**
   * Replaces the public shortcuts. An empty string clears that shortcut.
   */
  async saveShortcuts(input: SiteContacts): Promise<SiteContacts> {
    return this.siteContactRepository.save({
      whatsapp: emptyToUndefined(input.whatsapp),
      phone: emptyToUndefined(input.phone),
      email: emptyToUndefined(input.email),
      facebook: emptyToUndefined(input.facebook),
      instagram: emptyToUndefined(input.instagram),
    });
  }
}

function emptyToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : undefined;
}
