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

  /**
   * Creates an area with both names.
   */
  async createArea(input: {
    readonly nameAr: string;
    readonly nameEn: string;
  }): Promise<AreaEntity> {
    return this.areaRepository.create(input);
  }

  /**
   * Renames an area. An unknown id is not found.
   */
  async updateArea(
    id: string,
    input: { readonly nameAr: string; readonly nameEn: string },
  ): Promise<AreaEntity> {
    const area = await this.areaRepository.update(id, input);
    if (!area) {
      throw new ResourceNotFoundException('Area', id);
    }
    return area;
  }

  /**
   * Removes an area that has no places.
   */
  async deleteArea(id: string): Promise<void> {
    const removed = await this.areaRepository.delete(id);
    if (!removed) {
      throw new ResourceNotFoundException('Area', id);
    }
  }
}
