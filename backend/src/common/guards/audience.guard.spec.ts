import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { AudienceGuard } from '@/common/guards/audience.guard';

describe('AudienceGuard', () => {
  const reflector = new Reflector();
  const guard = new AudienceGuard(reflector);

  it('rejects a token from another audience', () => {
    @Audience(ApiAudience.DashboardOwner)
    class OwnerController {
      me(): void {}
    }
    const context = fakeContext(OwnerController, {
      id: '1',
      audience: ApiAudience.ClientApp,
      staffRole: null,
      tokenVersion: 0,
    });
    expect(() => guard.canActivate(context)).toThrow();
  });

  it('allows the matching audience and skips public routes', () => {
    @Audience(ApiAudience.ClientApp)
    class ClientController {
      @PublicRoute()
      signIn(): void {}
      me(): void {}
    }
    const visitor = { id: '1', audience: ApiAudience.ClientApp, staffRole: null, tokenVersion: 0 };
    expect(guard.canActivate(fakeContext(ClientController, visitor, 'signIn'))).toBe(true);
    expect(guard.canActivate(fakeContext(ClientController, visitor, 'me'))).toBe(true);
  });
});

function fakeContext(
  target: new () => object,
  user: { id: string; audience: ApiAudience; staffRole: null; tokenVersion: number },
  handlerName: 'me' | 'signIn' = 'me',
): ExecutionContext {
  const handler = handlerName === 'signIn' ? target.prototype.signIn : target.prototype.me;
  return {
    getHandler: () => handler,
    getClass: () => target,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as ExecutionContext;
}
