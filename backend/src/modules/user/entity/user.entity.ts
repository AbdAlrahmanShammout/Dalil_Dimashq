import { BaseEntity } from '@/common/base/base.entity';
import { ProfileEntity } from '@/modules/user/entity/profile.entity';
import { StaffRole } from '@/modules/user/enum/general.enum';
import { UserZodType } from '@/modules/user/zod/user.zod';

export class UserEntity extends BaseEntity {
  email!: string;
  passwordHash!: string | null;
  tokenVersion!: number;
  emailVerifiedAt!: Date | null;
  isVisitor!: boolean;
  isOwner!: boolean;
  staffRole!: StaffRole | null;
  profile?: ProfileEntity | null;

  constructor(data: UserZodType) {
    super();
    Object.assign(this, data);
  }
}
