import { MailConfigService } from '@/config/mail/mail-config.service';
import { MailManagerService } from '@/providers/mail/mail-manager.service';

const sendMail = jest.fn().mockResolvedValue({});

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail })),
}));

describe('MailManagerService', () => {
  const config = {
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    user: 'user',
    password: 'secret',
    fromAddress: 'Dalil Dimashq <noreply@dalil.local>',
  } as MailConfigService;

  it('sends a signup code without opening a live inbox', async () => {
    const service = new MailManagerService(config);
    await service.sendSignupCode({ to: 'person@example.com', code: '123456' });
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'person@example.com',
        text: 'Your confirmation code is 123456',
      }),
    );
  });

  it('sends a password reset code', async () => {
    const service = new MailManagerService(config);
    await service.sendPasswordReset({ to: 'person@example.com', code: '654321' });
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Your reset code is 654321' }),
    );
  });
});
