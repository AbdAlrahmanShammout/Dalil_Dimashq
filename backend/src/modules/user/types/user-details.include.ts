import type { Prisma } from '@prisma/client';

export const userDetailsInclude = {
  profile: true,
} satisfies Prisma.UserInclude;
