export const FIXED_PHONE_CODE = '000000';

export abstract class SmsSender {
  abstract sendVerificationCode(phone: string): Promise<void>;
  abstract accepts(code: string): boolean;
}
