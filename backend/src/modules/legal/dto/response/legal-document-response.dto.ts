import { ApiProperty } from '@nestjs/swagger';

import { LegalText } from '@/modules/legal/repository/legal.repository';

export class LegalDocumentResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly kind: 'terms' | 'privacy';

  @ApiProperty()
  readonly language: 'ar' | 'en';

  @ApiProperty()
  readonly body: string;

  constructor(document: LegalText) {
    this.id = document.id;
    this.kind = document.kind;
    this.language = document.language;
    this.body = document.body;
  }
}
