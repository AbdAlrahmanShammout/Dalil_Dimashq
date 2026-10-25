import { SiteContactService } from '@/modules/contact/site-contact.service';
import {
  SiteContactRepository,
  SiteContacts,
} from '@/modules/contact/repository/site-contact.repository';

class MemorySiteContactRepository extends SiteContactRepository {
  async read(): Promise<SiteContacts> {
    return { phone: '+963944000000', email: undefined };
  }
}

describe('SiteContactService', () => {
  it('omits empty shortcuts', async () => {
    const actual = await new SiteContactService(new MemorySiteContactRepository()).readShortcuts();
    expect(actual.phone).toBe('+963944000000');
    expect(actual.email).toBeUndefined();
  });
});
