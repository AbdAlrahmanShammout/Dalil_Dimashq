import { createHash, randomInt, timingSafeEqual } from 'crypto';

import { EMAIL_CODE_LENGTH, PASSWORD_MIN_LENGTH } from '@/modules/user/enum/general.enum';

export function isPasswordAcceptable(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH && /[A-Za-z]/.test(password) && /\d/.test(password);
}

export function createNumericCode(): string {
  return randomInt(0, 10 ** EMAIL_CODE_LENGTH)
    .toString()
    .padStart(EMAIL_CODE_LENGTH, '0');
}

export function hashSecret(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function doesHashMatch(storedHash: string, candidateHash: string): boolean {
  const stored = Buffer.from(storedHash, 'hex');
  const candidate = Buffer.from(candidateHash, 'hex');
  if (stored.length === 0 || stored.length !== candidate.length) {
    return false;
  }
  return timingSafeEqual(stored, candidate);
}
