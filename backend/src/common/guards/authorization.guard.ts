import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { STAFF_ROLE_ADMIN } from '@/common/constants/staff-role';
import { ROLES_KEY } from '@/common/decorators/route/roles.decorator';
import { AccessDeniedException } from '@/common/exceptions/access-denied.exception';

interface RequestWithPrincipal {
  user?: { staffRole?: string | null };
}

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<readonly string[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest<RequestWithPrincipal>();
    const staffRole = request.user?.staffRole ?? null;
    if (staffRole === STAFF_ROLE_ADMIN || (staffRole !== null && roles.includes(staffRole))) {
      return true;
    }
    throw new AccessDeniedException();
  }
}
