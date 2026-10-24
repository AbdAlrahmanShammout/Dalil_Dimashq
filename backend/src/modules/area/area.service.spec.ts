import { AreaEntity } from '@/modules/area/entity/area.entity';
import { AreaRepository } from '@/modules/area/repository/area.repository';
import { AreaService } from '@/modules/area/area.service';

class MemoryAreaRepository extends AreaRepository {
  readonly areas: AreaEntity[] = [];

  async list(): Promise<AreaEntity[]> {
    return [...this.areas];
  }

  async findById(id: string): Promise<AreaEntity | null> {
    return this.areas.find((area) => area.id === id) ?? null;
  }
}

describe('AreaService', () => {
  it('returns both names', async () => {
    const repository = new MemoryAreaRepository();
    repository.areas.push(
      new AreaEntity({
        id: 'area-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        nameAr: 'المالكي',
        nameEn: 'Malki',
      }),
    );
    const actual = await new AreaService(repository).listAreas();
    expect(actual[0].nameAr).toBe('المالكي');
    expect(actual[0].nameEn).toBe('Malki');
  });
});
