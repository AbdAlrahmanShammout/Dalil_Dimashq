import { z } from 'zod';

import {
  BaseZodSchema,
  ZodBoolean,
  ZodNumber,
  ZodString,
  ZodStringNullable,
} from '@/common/base/base.zod';
import { PlaceStatus, PlaceType } from '@/modules/place/enum/general.enum';

export const PlaceZodSchema = BaseZodSchema.extend({
  nameAr: ZodString,
  nameEn: ZodString,
  type: z.nativeEnum(PlaceType),
  status: z.nativeEnum(PlaceStatus),
  areaId: ZodString,
  addressAr: ZodStringNullable,
  addressEn: ZodStringNullable,
  latitude: ZodNumber.nullable(),
  longitude: ZodNumber.nullable(),
  isFeatured: ZodBoolean,
  starValue: ZodNumber.nullable(),
  starSource: ZodStringNullable,
  phone: ZodStringNullable,
  website: ZodStringNullable,
  email: ZodStringNullable,
  facebook: ZodStringNullable,
  instagram: ZodStringNullable,
});

export type PlaceZodType = z.infer<typeof PlaceZodSchema>;
