import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { AreaEntity } from '@/modules/area/entity/area.entity';
import { AreaRepository } from '@/modules/area/repository/area.repository';

@Injectable()
export class AreaService {
  constructor(private readonly areaRepository: AreaRepository) {}

  /**
   * Public area list used by search filters.
   */
  async listAreas(): Promise<AreaEntity[]> {
    return this.areaRepository.list();
  }

  /**
   * Loads one area or throws when the id is unknown.
   */
  async requireArea(id: string): Promise<AreaEntity> {
    const area = await this.areaRepository.findById(id);
    if (!area) {
      throw new ResourceNotFoundException('Area', id);
    }
    return area;
  }
}
