import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Principal } from '@/common/auth/principal.interface';
import { UnauthenticatedException } from '@/common/exceptions/unauthenticated.exception';
import { JwtConfigService } from '@/config/jwt/jwt-config.service';
import { UserService } from '@/modules/user/user.service';
import { assertAccessTokenPayload } from '@/providers/jwt/jwt-manager.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    jwtConfigService: JwtConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfigService.accessSecret,
      ignoreExpiration: false,
    });
  }

  /**
   * Loads the principal and rejects a token whose version was bumped by a password change.
   */
  async validate(payload: unknown): Promise<Principal> {
    const token = assertAccessTokenPayload(payload);
    const user = await this.userService.findById(token.sub);
    if (!user || user.tokenVersion !== token.tokenVersion) {
      throw new UnauthenticatedException();
    }
    return {
      id: user.id,
      audience: token.aud,
      staffRole: user.staffRole,
      tokenVersion: user.tokenVersion,
    };
  }
}
