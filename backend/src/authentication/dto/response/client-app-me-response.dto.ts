import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '@/modules/user/entity/user.entity';

export class ClientAppMeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isVisitor: boolean;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.isVisitor = user.isVisitor;
  }
}
