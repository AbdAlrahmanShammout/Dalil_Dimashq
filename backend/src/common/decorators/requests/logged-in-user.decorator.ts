import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Principal } from '@/common/auth/principal.interface';

export const LoggedInUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Principal => {
    const request = context.switchToHttp().getRequest<{ user: Principal }>();
    return request.user;
  },
);
