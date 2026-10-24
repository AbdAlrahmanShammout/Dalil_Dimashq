import { ApiAudience } from '@/common/auth/principal.interface';

export interface AccessTokenPayload {
  readonly sub: string;
  readonly aud: ApiAudience;
  readonly tokenVersion: number;
}
