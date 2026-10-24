import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '@/common/decorators/route/public-route.decorator';
import { AuthenticationGuard } from '@/common/guards/authentication.guard';

describe('AuthenticationGuard', () => {
  it('allows a route marked public without a token', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(true),
    } as unknown as Reflector;
    const guard = new AuthenticationGuard(reflector);
    const context = { getHandler: jest.fn(), getClass: jest.fn() } as unknown as ExecutionContext;
    expect(guard.canActivate(context)).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  });
});
