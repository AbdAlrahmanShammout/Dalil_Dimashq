import { OwnerPlaceService } from '@/modules/owner-place/owner-place.service';
import {
  OwnedPlaceSummary,
  PlaceNamePage,
  PlaceOwnerRepository,
} from '@/modules/owner-place/repository/place-owner.repository';

class MemoryPlaceOwnerRepository extends PlaceOwnerRepository {
  readonly linked: string[] = [];
  readonly rows: OwnedPlaceSummary[] = [
    {
      id: 'place-1',
      nameAr: 'مقهى',
      nameEn: 'Cafe',
      type: 'cafe',
      addressAr: 'المزة',
      addressEn: 'Mazzeh',
      premiumActive: false,
      premiumEndsAt: null,
      pendingRequestCount: 0,
    },
  ];

  searchPage: PlaceNamePage = { places: [], total: 0, limit: 20, offset: 0 };

  async listByUser(): Promise<OwnedPlaceSummary[]> {
    return this.rows;
  }

  async searchByName(): Promise<PlaceNamePage> {
    return this.searchPage;
  }

  async findClaimTarget(placeId: string): Promise<{ claimCode: string | null } | null> {
    if (placeId === 'missing') {
      return null;
    }
    return { claimCode: 'DD-1001' };
  }

  async linkOwner(userId: string, placeId: string): Promise<void> {
    this.linked.push(`${userId}:${placeId}`);
  }
}

describe('OwnerPlaceService', () => {
  it('returns the linked place name, type, and address', async () => {
    const service = new OwnerPlaceService(new MemoryPlaceOwnerRepository());
    const places = await service.listMine('user-1');
    expect(places).toEqual([
      {
        id: 'place-1',
        nameAr: 'مقهى',
        nameEn: 'Cafe',
        type: 'cafe',
        addressAr: 'المزة',
        addressEn: 'Mazzeh',
        premiumActive: false,
        premiumEndsAt: null,
        pendingRequestCount: 0,
      },
    ]);
  });

  it('returns a name page without requiring a link', async () => {
    const repository = new MemoryPlaceOwnerRepository();
    repository.searchPage = {
      places: [
        {
          id: 'place-2',
          nameAr: 'كافيه',
          nameEn: 'Cafe',
          type: 'cafe',
          addressAr: null,
          addressEn: null,
        },
      ],
      total: 2,
      limit: 1,
      offset: 0,
    };
    const service = new OwnerPlaceService(repository);
    const page = await service.searchByName({ name: 'cafe', limit: 1, offset: 0 });
    expect(page.total).toBe(2);
    expect(page.places).toHaveLength(1);
  });

  it('links only when the code starts with DD- and matches', async () => {
    const repository = new MemoryPlaceOwnerRepository();
    const service = new OwnerPlaceService(repository);
    await expect(
      service.claimWithCode({ userId: 'user-1', placeId: 'place-1', code: '1001' }),
    ).rejects.toMatchObject({ code: 'invalid_code' });
    await expect(
      service.claimWithCode({ userId: 'user-1', placeId: 'place-1', code: 'DD-9999' }),
    ).rejects.toMatchObject({ code: 'invalid_code' });
    expect(repository.linked).toHaveLength(0);
    await service.claimWithCode({ userId: 'user-1', placeId: 'place-1', code: 'DD-1001' });
    expect(repository.linked).toEqual(['user-1:place-1']);
  });
});
