import { BaseEntity } from '@/common/base/base.entity';
import { AreaZodType } from '@/modules/area/zod/area.zod';

export class AreaEntity extends BaseEntity {
  nameAr!: string;
  nameEn!: string;

  constructor(data: AreaZodType) {
    super();
    Object.assign(this, data);
  }
}
