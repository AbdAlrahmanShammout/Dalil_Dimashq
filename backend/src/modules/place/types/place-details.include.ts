import { Prisma } from '@prisma/client';

export const placeDetailsInclude = {
  area: true,
} satisfies Prisma.PlaceInclude;
