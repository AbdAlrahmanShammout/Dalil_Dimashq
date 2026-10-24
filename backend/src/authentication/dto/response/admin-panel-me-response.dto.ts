import { ApiProperty } from '@nestjs/swagger';

import { StaffRole } from '@/modules/user/enum/general.enum';
import { UserEntity } from '@/modules/user/entity/user.entity';

export class AdminPanelMeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: StaffRole, nullable: true })
  staffRole: StaffRole | null;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.staffRole = user.staffRole;
  }
}
