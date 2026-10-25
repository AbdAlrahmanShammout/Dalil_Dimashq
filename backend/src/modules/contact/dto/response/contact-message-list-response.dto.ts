import { ApiProperty } from '@nestjs/swagger';

import { ContactMessageItem } from '@/modules/contact/repository/contact-message.repository';

class ContactMessageItemResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty({ nullable: true })
  readonly email: string | null;

  @ApiProperty({ nullable: true })
  readonly phone: string | null;

  @ApiProperty()
  readonly type: string;

  @ApiProperty()
  readonly message: string;

  @ApiProperty()
  readonly createdAt: Date;

  constructor(item: ContactMessageItem) {
    this.id = item.id;
    this.name = item.name;
    this.email = item.email;
    this.phone = item.phone;
    this.type = item.type;
    this.message = item.message;
    this.createdAt = item.createdAt;
  }
}

export class ContactMessageListResponseDto {
  @ApiProperty({ type: [ContactMessageItemResponseDto] })
  readonly messages: ContactMessageItemResponseDto[];

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly offset: number;

  constructor(page: {
    items: readonly ContactMessageItem[];
    total: number;
    limit: number;
    offset: number;
  }) {
    this.messages = page.items.map((item) => new ContactMessageItemResponseDto(item));
    this.total = page.total;
    this.limit = page.limit;
    this.offset = page.offset;
  }
}
