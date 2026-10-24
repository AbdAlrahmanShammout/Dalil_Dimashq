import { ERROR_TEXT } from '@/common/filter/error-text';

describe('ERROR_TEXT', () => {
  it('seeds the codes the clients already branch on', () => {
    expect(ERROR_TEXT.phone_taken.ar.length).toBeGreaterThan(0);
    expect(ERROR_TEXT.too_young.en.length).toBeGreaterThan(0);
    expect(ERROR_TEXT.not_allowed.en.length).toBeGreaterThan(0);
    expect(ERROR_TEXT.email_not_confirmed.en.length).toBeGreaterThan(0);
  });
});
