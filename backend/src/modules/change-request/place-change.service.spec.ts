import { PlaceService } from '@/modules/place/place.service';
import { PlaceChangeService } from '@/modules/change-request/place-change.service';
import {
  CreatePlaceChangeRepoInput,
  PlaceChangeRecord,
  PlaceChangeRepository,
} from '@/modules/change-request/repository/place-change.repository';

class MemoryPlaceChangeRepository extends PlaceChangeRepository {
  readonly rows: PlaceChangeRecord[] = [];

  async create(input: CreatePlaceChangeRepoInput): Promise<PlaceChangeRecord> {
    const row: PlaceChangeRecord = {
      id: `change-${this.rows.length + 1}`,
      placeId: input.placeId,
      userId: input.userId,
      kind: input.kind,
      status: 'pending',
      reason: input.reason,
      decisionNote: null,
    };
    this.rows.push(row);
    return row;
  }
}

describe('PlaceChangeService', () => {
  const repository = new MemoryPlaceChangeRepository();
  const placeService = {
    getPublicPlace: async (id: string) => ({ id }),
  } as unknown as PlaceService;
  const service = new PlaceChangeService(repository, placeService);

  it('refuses an empty report reason', async () => {
    await expect(
      service.reportPlace({ userId: 'user-1', placeId: 'place-1', reason: '   ' }),
    ).rejects.toMatchObject({ code: 'reason' });
    expect(repository.rows).toHaveLength(0);
    const created = await service.reportPlace({
      userId: 'user-1',
      placeId: 'place-1',
      reason: 'Closed for good',
    });
    expect(created.kind).toBe('report');
    expect(created.status).toBe('pending');
    const claim = await service.openClaim({ userId: 'user-1', placeId: 'place-1' });
    expect(claim.kind).toBe('claim');
    expect(repository.rows[1].reason).toBeNull();
  });
});
