import { ApiPropertyOptional } from '@nestjs/swagger';

import { SiteContacts } from '@/modules/contact/repository/site-contact.repository';

export class SiteContactsResponseDto {
  @ApiPropertyOptional()
  readonly whatsapp?: string;

  @ApiPropertyOptional()
  readonly phone?: string;

  @ApiPropertyOptional()
  readonly email?: string;

  @ApiPropertyOptional()
  readonly facebook?: string;

  @ApiPropertyOptional()
  readonly instagram?: string;

  constructor(contacts: SiteContacts) {
    this.whatsapp = contacts.whatsapp;
    this.phone = contacts.phone;
    this.email = contacts.email;
    this.facebook = contacts.facebook;
    this.instagram = contacts.instagram;
  }
}
