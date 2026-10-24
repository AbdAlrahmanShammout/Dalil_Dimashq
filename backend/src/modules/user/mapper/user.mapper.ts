import { UserEntity } from '@/modules/user/entity/user.entity';
import { StaffRole } from '@/modules/user/enum/general.enum';
import { ProfileMapper } from '@/modules/user/mapper/profile.mapper';
import { UserType } from '@/modules/user/types/user-details-schema.type';

export class UserMapper {
  static toEntity(schema: UserType): UserEntity {
    return new UserEntity({
      id: schema.id,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      deletedAt: null,
      email: schema.email,
      passwordHash: schema.passwordHash,
      tokenVersion: schema.tokenVersion,
      emailVerifiedAt: schema.emailVerifiedAt,
      isVisitor: schema.isVisitor,
      isOwner: schema.isOwner,
      staffRole: schema.staffRole as StaffRole | null,
      profile: schema.profile ? ProfileMapper.toEntity(schema.profile) : null,
    });
  }
}
