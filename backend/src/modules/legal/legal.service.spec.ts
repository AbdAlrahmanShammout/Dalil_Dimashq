import { LegalService } from '@/modules/legal/legal.service';
import { LegalRepository, LegalText } from '@/modules/legal/repository/legal.repository';

class MemoryLegalRepository extends LegalRepository {
  async findCurrent(kind: 'terms' | 'privacy', language: 'ar' | 'en'): Promise<LegalText | null> {
    if (kind !== 'terms' || language !== 'ar') {
      return null;
    }
    return { id: 'doc-1', kind, language, body: 'النص' };
  }
}

describe('LegalService', () => {
  it('returns the current text', async () => {
    const actual = await new LegalService(new MemoryLegalRepository()).readCurrent('terms', 'ar');
    expect(actual.body).toBe('النص');
  });
});
