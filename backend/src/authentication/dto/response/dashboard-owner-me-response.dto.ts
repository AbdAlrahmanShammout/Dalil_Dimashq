import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '@/modules/user/entity/user.entity';

export class DashboardOwnerMeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isOwner: boolean;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.isOwner = user.isOwner;
  }
}
