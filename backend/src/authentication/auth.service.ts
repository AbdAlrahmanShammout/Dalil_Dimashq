import { createHash, randomBytes } from 'crypto';

import { Injectable } from '@nestjs/common';

import { ApiAudience } from '@/common/auth/principal.interface';
import { JwtConfigService } from '@/config/jwt/jwt-config.service';
import {
  AuthenticateServiceInput,
  SignUpResult,
  SignUpServiceInput,
  VerifyEmailServiceInput,
} from '@/modules/user/defs/user.defs';
import { EmailCodePurpose } from '@/modules/user/enum/general.enum';
import { UserService } from '@/modules/user/user.service';
import { JwtManagerService } from '@/providers/jwt/jwt-manager.service';
import { MailManagerService } from '@/providers/mail/mail-manager.service';

export interface AuthSession {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtManagerService: JwtManagerService,
    private readonly mailManagerService: MailManagerService,
    private readonly jwtConfigService: JwtConfigService,
  ) {}

  /**
   * Opens one door and sends the signup code when the email is not confirmed yet.
   */
  async signUp(input: SignUpServiceInput): Promise<Pick<SignUpResult, 'status'>> {
    const result = await this.userService.signUp(input);
    if (result.code) {
      await this.mailManagerService.sendSignupCode({ to: result.email, code: result.code });
    }
    return { status: result.status };
  }

  async verifyEmail(input: Omit<VerifyEmailServiceInput, 'purpose'>): Promise<void> {
    await this.userService.verifyEmail({ ...input, purpose: EmailCodePurpose.Signup });
  }

  async signIn(
    input: AuthenticateServiceInput & { readonly audience: ApiAudience },
  ): Promise<AuthSession> {
    const user = await this.userService.authenticate(input);
    return this.issueSession(user.id, user.tokenVersion, input.audience);
  }

  async refresh(input: {
    readonly refreshToken: string;
    readonly audience: ApiAudience;
  }): Promise<AuthSession> {
    const refreshToken = createOpaqueToken();
    const user = await this.userService.rotateRefreshToken({
      refreshToken: input.refreshToken,
      audience: input.audience,
      nextTokenHash: hashToken(refreshToken),
      nextExpiresAt: this.refreshExpiry(),
    });
    return {
      accessToken: this.jwtManagerService.signAccess({
        subject: user.id,
        audience: input.audience,
        tokenVersion: user.tokenVersion,
      }),
      refreshToken,
      expiresIn: this.jwtConfigService.accessTtlSeconds,
    };
  }

  private async issueSession(
    userId: string,
    tokenVersion: number,
    audience: ApiAudience,
  ): Promise<AuthSession> {
    const refreshToken = createOpaqueToken();
    await this.userService.saveRefreshToken({
      userId,
      audience,
      tokenHash: hashToken(refreshToken),
      expiresAt: this.refreshExpiry(),
    });
    return {
      accessToken: this.jwtManagerService.signAccess({ subject: userId, audience, tokenVersion }),
      refreshToken,
      expiresIn: this.jwtConfigService.accessTtlSeconds,
    };
  }

  private refreshExpiry(): Date {
    return new Date(Date.now() + this.jwtConfigService.refreshTtlSeconds * 1000);
  }
}

function createOpaqueToken(): string {
  return randomBytes(32).toString('base64url');
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
