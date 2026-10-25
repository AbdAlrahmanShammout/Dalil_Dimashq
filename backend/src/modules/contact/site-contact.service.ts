import { Injectable, Optional } from '@nestjs/common';

import { AuditLogService, writeStaffAudit } from '@/modules/audit-log/audit-log.service';

import {
  SiteContactRepository,
  SiteContacts,
} from '@/modules/contact/repository/site-contact.repository';

@Injectable()
export class SiteContactService {
  constructor(
    private readonly siteContactRepository: SiteContactRepository,
    @Optional() private readonly auditLogService?: AuditLogService,
  ) {}

  /**
   * Public shortcuts. Empty values are omitted.
   */
  async readShortcuts(): Promise<SiteContacts> {
    return this.siteContactRepository.read();
  }

  /**
   * Replaces the public shortcuts. An empty string clears that shortcut.
   */
  async saveShortcuts(input: SiteContacts, actorId?: string): Promise<SiteContacts> {
    const saved = await this.siteContactRepository.save({
      whatsapp: emptyToUndefined(input.whatsapp),
      phone: emptyToUndefined(input.phone),
      email: emptyToUndefined(input.email),
      facebook: emptyToUndefined(input.facebook),
      instagram: emptyToUndefined(input.instagram),
    });
    await writeStaffAudit(this.auditLogService, {
      actorId,
      action: 'site_contacts_saved',
      targetType: 'site_contact',
      targetId: 'site',
    });
    return saved;
  }
}

function emptyToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : undefined;
}
