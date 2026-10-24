import { AreaEntity } from '@/modules/area/entity/area.entity';

export abstract class AreaRepository {
  abstract list(): Promise<AreaEntity[]>;
  abstract findById(id: string): Promise<AreaEntity | null>;
}
