import { ApiProperty } from '@nestjs/swagger';

import { ImmediatePlaceFields } from '@/modules/owner-place/repository/place-owner.repository';

export class ImmediatePlaceResponseDto {
  @ApiProperty({ nullable: true })
  readonly phone: string | null;

  @ApiProperty({ nullable: true })
  readonly website: string | null;

  @ApiProperty({ nullable: true })
  readonly email: string | null;

  @ApiProperty({ nullable: true })
  readonly facebook: string | null;

  @ApiProperty({ nullable: true })
  readonly instagram: string | null;

  @ApiProperty({ nullable: true })
  readonly descriptionAr: string | null;

  @ApiProperty({ nullable: true })
  readonly descriptionEn: string | null;

  constructor(fields: ImmediatePlaceFields) {
    this.phone = fields.phone ?? null;
    this.website = fields.website ?? null;
    this.email = fields.email ?? null;
    this.facebook = fields.facebook ?? null;
    this.instagram = fields.instagram ?? null;
    this.descriptionAr = fields.descriptionAr ?? null;
    this.descriptionEn = fields.descriptionEn ?? null;
  }
}
