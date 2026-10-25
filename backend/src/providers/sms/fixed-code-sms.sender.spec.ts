import { FixedCodeSmsSender } from '@/providers/sms/fixed-code-sms.sender';

describe('FixedCodeSmsSender', () => {
  it('does not send and accepts only six zeros', async () => {
    const sender = new FixedCodeSmsSender();
    await expect(sender.sendVerificationCode('+963944000000')).resolves.toBeUndefined();
    expect(sender.accepts('000000')).toBe(true);
    expect(sender.accepts('123456')).toBe(false);
  });
});
