import { SuggestionService } from '@/modules/contact/suggestion.service';
import {
  CreateSuggestionInput,
  SuggestionRepository,
} from '@/modules/contact/repository/suggestion.repository';

class MemorySuggestionRepository extends SuggestionRepository {
  readonly rows: CreateSuggestionInput[] = [];

  async countSince(visitorKey: string, since: Date): Promise<number> {
    return this.rows.filter((row) => row.visitorKey === visitorKey && row.now >= since).length;
  }

  async create(input: CreateSuggestionInput): Promise<{ id: string }> {
    this.rows.push(input);
    return { id: `suggestion-${this.rows.length}` };
  }
}

describe('SuggestionService', () => {
  it('stores a missing place and refuses an unknown kind', async () => {
    const repository = new MemorySuggestionRepository();
    const service = new SuggestionService(repository);
    const actual = await service.submit({
      name: 'Ahmad',
      contact: 'a@example.com',
      kind: 'missing_place',
      message: 'A cafe on the corner',
      visitorKey: 'visitor-1',
      bodyBytes: 40,
    });
    expect(actual.id).toBe('suggestion-1');
    await expect(
      service.submit({
        name: 'Ahmad',
        contact: 'a@example.com',
        kind: 'spam',
        message: 'no',
        visitorKey: 'visitor-1',
        bodyBytes: 20,
      }),
    ).rejects.toMatchObject({ code: 'kind_invalid' });
  });
});
