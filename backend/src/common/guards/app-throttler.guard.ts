import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(request: Record<string, unknown>): Promise<string> {
    const body = request.body;
    const email = readEmail(body);
    const ip = typeof request.ip === 'string' ? request.ip : 'unknown';
    return email.length > 0 ? `${ip}:${email}` : ip;
  }
}

function readEmail(body: unknown): string {
  if (typeof body !== 'object' || body === null || !('email' in body)) {
    return '';
  }
  const email = (body as { email?: unknown }).email;
  return typeof email === 'string' ? email.toLowerCase() : '';
}
