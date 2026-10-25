import { ApiProperty } from '@nestjs/swagger';

import { SuggestionQueueItem } from '@/modules/contact/repository/suggestion.repository';

class SuggestionQueueItemResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly contact: string;

  @ApiProperty()
  readonly kind: string;

  @ApiProperty()
  readonly message: string;

  @ApiProperty({ nullable: true })
  readonly placeId: string | null;

  @ApiProperty()
  readonly status: string;

  @ApiProperty()
  readonly createdAt: Date;

  constructor(item: SuggestionQueueItem) {
    this.id = item.id;
    this.name = item.name;
    this.contact = item.contact;
    this.kind = item.kind;
    this.message = item.message;
    this.placeId = item.placeId;
    this.status = item.status;
    this.createdAt = item.createdAt;
  }
}

export class SuggestionListResponseDto {
  @ApiProperty({ type: [SuggestionQueueItemResponseDto] })
  readonly suggestions: SuggestionQueueItemResponseDto[];

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly offset: number;

  constructor(page: {
    items: readonly SuggestionQueueItem[];
    total: number;
    limit: number;
    offset: number;
  }) {
    this.suggestions = page.items.map((item) => new SuggestionQueueItemResponseDto(item));
    this.total = page.total;
    this.limit = page.limit;
    this.offset = page.offset;
  }
}
