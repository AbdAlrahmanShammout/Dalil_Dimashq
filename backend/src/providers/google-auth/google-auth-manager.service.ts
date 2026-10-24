import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import { UnauthenticatedException } from '@/common/exceptions/unauthenticated.exception';
import { GoogleAuthConfigService } from '@/config/google-auth/google-auth-config.service';

export interface GoogleIdentity {
  readonly email: string;
  readonly subject: string;
}

@Injectable()
export class GoogleAuthManagerService {
  constructor(private readonly googleAuthConfigService: GoogleAuthConfigService) {}

  /**
   * Verifies a Google identity token and returns the email. It never creates an owner.
   */
  async verifyIdentityToken(idToken: string): Promise<GoogleIdentity> {
    if (!this.googleAuthConfigService.isConfigured) {
      throw new UnauthenticatedException({
        message: 'Google token invalid',
        code: 'google_token_invalid',
      });
    }
    try {
      const client = new OAuth2Client(this.googleAuthConfigService.clientId);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: this.googleAuthConfigService.clientId,
      });
      const payload = ticket.getPayload();
      if (!payload?.email || payload.email_verified !== true || !payload.sub) {
        throw new UnauthenticatedException({
          message: 'Google token invalid',
          code: 'google_token_invalid',
        });
      }
      return { email: payload.email.toLowerCase(), subject: payload.sub };
    } catch (error) {
      if (error instanceof UnauthenticatedException) {
        throw error;
      }
      throw new UnauthenticatedException({
        message: 'Google token invalid',
        code: 'google_token_invalid',
      });
    }
  }
}
