import { SetMetadata } from '@nestjs/common';

import { ApiAudience } from '@/common/auth/principal.interface';

export const AUDIENCE_KEY = 'audience';

export const Audience = (audience: ApiAudience): MethodDecorator & ClassDecorator =>
  SetMetadata(AUDIENCE_KEY, audience);
