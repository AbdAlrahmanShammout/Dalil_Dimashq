import { ApiProperty } from '@nestjs/swagger';

export class OwnerPhotoRoleResponseDto {
  @ApiProperty()
  readonly role: 'cover' | 'logo';

  constructor(role: 'cover' | 'logo') {
    this.role = role;
  }
}
