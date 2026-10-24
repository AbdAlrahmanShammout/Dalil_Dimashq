import { Prisma } from '@prisma/client';

import { OptionalRelations } from '@/common/base/base.entity';
import { placeDetailsInclude } from '@/modules/place/types/place-details.include';

export type PlaceDetailsSchema = OptionalRelations<
  Prisma.PlaceGetPayload<{ include: typeof placeDetailsInclude }>
>;
