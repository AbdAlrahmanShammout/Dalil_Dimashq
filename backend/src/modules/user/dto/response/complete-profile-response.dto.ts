import { ApiProperty } from '@nestjs/swagger';

import { ProfileLanguage } from '@/modules/user/enum/general.enum';
import { UserEntity } from '@/modules/user/entity/user.entity';

export class CompleteProfileResponseDto {
  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly birthYear: number;

  @ApiProperty({ enum: ProfileLanguage })
  readonly language: ProfileLanguage;

  constructor(user: UserEntity) {
    this.firstName = user.profile?.firstName ?? '';
    this.lastName = user.profile?.lastName ?? '';
    this.phone = user.profile?.phone ?? '';
    this.birthYear = user.profile?.birthYear ?? 0;
    this.language = user.profile?.language ?? ProfileLanguage.Arabic;
  }
}
