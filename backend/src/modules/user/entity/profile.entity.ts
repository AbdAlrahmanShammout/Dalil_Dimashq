import { ProfileLanguage } from '@/modules/user/enum/general.enum';

export class ProfileEntity {
  userId!: string;
  firstName!: string | null;
  lastName!: string | null;
  phone!: string | null;
  phoneVerifiedAt!: Date | null;
  birthYear!: number | null;
  language!: ProfileLanguage;
}
