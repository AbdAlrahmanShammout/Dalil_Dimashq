import { resolveErrorLanguage } from '@/common/filter/resolve-error-language';

describe('resolveErrorLanguage', () => {
  it('defaults to Arabic', () => {
    expect(resolveErrorLanguage(undefined)).toBe('ar');
    expect(resolveErrorLanguage('')).toBe('ar');
  });

  it('picks English when it is the preferred language', () => {
    expect(resolveErrorLanguage('en')).toBe('en');
    expect(resolveErrorLanguage('en-US,ar;q=0.5')).toBe('en');
  });

  it('keeps Arabic when it ranks above English', () => {
    expect(resolveErrorLanguage('ar,en;q=0.8')).toBe('ar');
  });
});
