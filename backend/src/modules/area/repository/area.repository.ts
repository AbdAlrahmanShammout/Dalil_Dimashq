import { AreaEntity } from '@/modules/area/entity/area.entity';

export interface SaveAreaInput {
  readonly nameAr: string;
  readonly nameEn: string;
}

export abstract class AreaRepository {
  abstract list(): Promise<AreaEntity[]>;
  abstract findById(id: string): Promise<AreaEntity | null>;

  create(_input: SaveAreaInput): Promise<AreaEntity> {
    return Promise.reject(new Error('create is not implemented'));
  }

  update(_id: string, _input: SaveAreaInput): Promise<AreaEntity | null> {
    return Promise.resolve(null);
  }

  delete(_id: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}
