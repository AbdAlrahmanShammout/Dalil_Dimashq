import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Principal, ApiAudience } from '@/common/auth/principal.interface';
import { AUDIENCE_KEY } from '@/common/decorators/route/audience.decorator';
import { IS_PUBLIC_KEY } from '@/common/decorators/route/public-route.decorator';
import { UnauthenticatedException } from '@/common/exceptions/unauthenticated.exception';

@Injectable()
export class AudienceGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const audience = this.reflector.getAllAndOverride<ApiAudience>(AUDIENCE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!audience) {
      return true;
    }
    const request = context.switchToHttp().getRequest<{ user?: Principal }>();
    if (request.user?.audience !== audience) {
      throw new UnauthenticatedException();
    }
    return true;
  }
}
