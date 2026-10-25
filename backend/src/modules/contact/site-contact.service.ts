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
}
