import { ProfileEntity } from '@/modules/user/entity/profile.entity';
import { ProfileLanguage } from '@/modules/user/enum/general.enum';
import { UserType } from '@/modules/user/types/user-details-schema.type';

export class ProfileMapper {
  static toEntity(schema: NonNullable<UserType['profile']>): ProfileEntity {
    const entity = new ProfileEntity();
    entity.userId = schema.userId;
    entity.firstName = schema.firstName;
    entity.lastName = schema.lastName;
    entity.phone = schema.phone;
    entity.phoneVerifiedAt = schema.phoneVerifiedAt;
    entity.birthYear = schema.birthYear;
    entity.language = schema.language as ProfileLanguage;
    return entity;
  }
}
