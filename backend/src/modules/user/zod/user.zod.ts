import { z } from 'zod';

import {
  BaseZodSchema,
  ZodBoolean,
  ZodDateNullable,
  ZodNumber,
  ZodString,
  ZodStringNullable,
} from '@/common/base/base.zod';
import { ProfileLanguage, StaffRole } from '@/modules/user/enum/general.enum';

export type ProfileZodType = z.infer<typeof ProfileZodSchema>;

export const ProfileZodSchema = z.object({
  userId: ZodString,
  firstName: ZodStringNullable,
  lastName: ZodStringNullable,
  phone: ZodStringNullable,
  phoneVerifiedAt: ZodDateNullable,
  birthYear: ZodNumber.nullable(),
  language: z.nativeEnum(ProfileLanguage),
});

export type UserZodType = z.infer<typeof UserZodSchema>;

export const UserZodSchema = BaseZodSchema.extend({
  email: ZodString,
  passwordHash: ZodStringNullable,
  tokenVersion: ZodNumber,
  emailVerifiedAt: ZodDateNullable,
  isVisitor: ZodBoolean,
  isOwner: ZodBoolean,
  staffRole: z.nativeEnum(StaffRole).nullable(),
  profile: (z.any() as z.ZodType<ProfileZodType | null | undefined>).optional(),
});
