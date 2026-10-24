import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '@/common/decorators/route/roles.decorator';
import { AccessDeniedException } from '@/common/exceptions/access-denied.exception';
import { AuthorizationGuard } from '@/common/guards/authorization.guard';

function createContext(staffRole: string | null): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user: { staffRole } }),
    }),
  } as unknown as ExecutionContext;
}

describe('AuthorizationGuard', () => {
  const reflector = {
    getAllAndOverride: jest.fn(),
  } as unknown as Reflector;
  const guard = new AuthorizationGuard(reflector);

  it('allows a route that declares no roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(guard.canActivate(createContext(null))).toBe(true);
  });

  it('treats admin as every staff role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['editor']);
    expect(guard.canActivate(createContext('admin'))).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, expect.anything());
  });

  it('rejects a staff role that was not requested', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['editor']);
    expect(() => guard.canActivate(createContext('sales'))).toThrow(AccessDeniedException);
  });
});
