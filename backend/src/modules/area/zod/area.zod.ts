import { z } from 'zod';

import { BaseZodSchema, ZodString } from '@/common/base/base.zod';

export const AreaZodSchema = BaseZodSchema.extend({
  nameAr: ZodString,
  nameEn: ZodString,
});

export type AreaZodType = z.infer<typeof AreaZodSchema>;
