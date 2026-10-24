import { Prisma } from '@prisma/client';

import { OptionalRelations } from '@/common/base/base.entity';

export type AreaDetailsSchema = OptionalRelations<Prisma.AreaGetPayload<Record<string, never>>>;
