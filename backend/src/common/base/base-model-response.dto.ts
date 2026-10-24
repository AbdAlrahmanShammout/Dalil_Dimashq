import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '@/common/base/base.entity';

export class BaseModelResponseDto {
  @ApiProperty({ example: 'ckv9exampleid' })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(data: Pick<BaseEntity, 'id' | 'createdAt' | 'updatedAt'>) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
