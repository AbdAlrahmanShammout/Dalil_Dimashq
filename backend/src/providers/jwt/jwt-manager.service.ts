import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';

import { ApiAudience } from '@/common/auth/principal.interface';
import { UnauthenticatedException } from '@/common/exceptions/unauthenticated.exception';
import { JwtConfigService } from '@/config/jwt/jwt-config.service';
import { AccessTokenPayload } from '@/providers/jwt/access-token-payload.type';

export interface SignAccessTokenInput {
  readonly subject: string;
  readonly audience: ApiAudience;
  readonly tokenVersion: number;
}

@Injectable()
export class JwtManagerService {
  constructor(private readonly jwtConfigService: JwtConfigService) {}

  /**
   * Signs an access token. Refresh tokens are opaque and are not signed here.
   */
  signAccess(input: SignAccessTokenInput): string {
    const payload: AccessTokenPayload = {
      sub: input.subject,
      aud: input.audience,
      tokenVersion: input.tokenVersion,
    };
    return jwt.sign(payload, this.jwtConfigService.accessSecret, {
      expiresIn: this.jwtConfigService.accessTtlSeconds,
    });
  }
}

export function isAccessTokenPayload(value: unknown): value is AccessTokenPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const payload = value as Partial<AccessTokenPayload>;
  return (
    typeof payload.sub === 'string' &&
    typeof payload.aud === 'string' &&
    typeof payload.tokenVersion === 'number' &&
    Object.values(ApiAudience).includes(payload.aud as ApiAudience)
  );
}

export function assertAccessTokenPayload(value: unknown): AccessTokenPayload {
  if (!isAccessTokenPayload(value)) {
    throw new UnauthenticatedException();
  }
  return value;
}
