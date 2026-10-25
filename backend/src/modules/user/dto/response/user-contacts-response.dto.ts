import { ApiProperty } from '@nestjs/swagger';

import { UserContacts } from '@/modules/user/repository/user.repository';

export class UserContactsResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty({ nullable: true })
  readonly phone: string | null;

  @ApiProperty()
  readonly emailVerified: boolean;

  constructor(contacts: UserContacts) {
    this.id = contacts.id;
    this.email = contacts.email;
    this.phone = contacts.phone;
    this.emailVerified = contacts.emailVerified;
  }
}
