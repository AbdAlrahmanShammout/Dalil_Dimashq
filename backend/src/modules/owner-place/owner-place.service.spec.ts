import { OwnerPlaceService } from '@/modules/owner-place/owner-place.service';
import {
  OwnedPlaceSummary,
  PlaceOwnerRepository,
} from '@/modules/owner-place/repository/place-owner.repository';

class MemoryPlaceOwnerRepository extends PlaceOwnerRepository {
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

  async listByUser(): Promise<OwnedPlaceSummary[]> {
    return this.rows;
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
});
