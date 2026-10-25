import { ContactMessageService } from '@/modules/contact/contact-message.service';
import {
  ContactMessageRepository,
  CreateContactMessageInput,
} from '@/modules/contact/repository/contact-message.repository';

class MemoryContactRepository extends ContactMessageRepository {
  readonly rows: CreateContactMessageInput[] = [];

  async countSince(visitorKey: string, since: Date): Promise<number> {
    return this.rows.filter((row) => row.visitorKey === visitorKey && row.now >= since).length;
  }

  async create(input: CreateContactMessageInput): Promise<{ id: string }> {
    this.rows.push(input);
    return { id: `message-${this.rows.length}` };
  }
}

describe('ContactMessageService', () => {
  it('refuses a filled honeypot and stores a normal message', async () => {
    const repository = new MemoryContactRepository();
    const service = new ContactMessageService(repository);
    await expect(
      service.submit({
        name: 'Ahmad',
        email: 'a@example.com',
        type: 'question',
        message: 'Hello',
        website: 'spam',
        visitorKey: 'visitor-1',
        bodyBytes: 20,
      }),
    ).rejects.toMatchObject({ code: 'honeypot' });
    const actual = await service.submit({
      name: 'Ahmad',
      phone: '0944000000',
      type: 'question',
      message: 'Hello',
      visitorKey: 'visitor-1',
      bodyBytes: 20,
    });
    expect(actual.id).toBe('message-1');
    expect(repository.rows).toHaveLength(1);
  });

  it('stops the sixth message in an hour', async () => {
    const repository = new MemoryContactRepository();
    const service = new ContactMessageService(repository);
    const now = new Date('2026-10-25T09:00:00Z');
    for (let index = 0; index < 5; index += 1) {
      await service.submit({
        name: 'Ahmad',
        email: 'a@example.com',
        type: 'question',
        message: 'Hello',
        visitorKey: 'visitor-1',
        bodyBytes: 20,
        now,
      });
    }
    await expect(
      service.submit({
        name: 'Ahmad',
        email: 'a@example.com',
        type: 'question',
        message: 'Hello',
        visitorKey: 'visitor-1',
        bodyBytes: 20,
        now,
      }),
    ).rejects.toMatchObject({ code: 'contact_rate' });
  });
});
