import { PlaceService } from '@/modules/place/place.service';
import {
  CreateRatingRepoInput,
  RatingRecord,
  RatingRepository,
} from '@/modules/rating/repository/rating.repository';
import { RatingService } from '@/modules/rating/rating.service';
import { UserService } from '@/modules/user/user.service';

class MemoryRatingRepository extends RatingRepository {
  readonly rows: RatingRecord[] = [];

  async findByVisitor(userId: string, placeId: string): Promise<RatingRecord | null> {
    return this.rows.find((row) => row.userId === userId && row.placeId === placeId) ?? null;
  }

  async create(input: CreateRatingRepoInput): Promise<RatingRecord> {
    const row: RatingRecord = {
      id: `rating-${this.rows.length + 1}`,
      userId: input.userId,
      placeId: input.placeId,
      stars: input.stars,
      status: 'held',
    };
    this.rows.push(row);
    return row;
  }
}

describe('RatingService', () => {
  const repository = new MemoryRatingRepository();
  const placeService = {
    getPublicPlace: async (id: string) => ({ id }),
  } as unknown as PlaceService;

  function buildService(verified: boolean): RatingService {
    const userService = {
      hasVerifiedPhone: async () => verified,
    } as unknown as UserService;
    return new RatingService(repository, placeService, userService);
  }

  it('stores nothing until the phone is verified, then keeps the rating held', async () => {
    const unverified = buildService(false);
    await expect(
      unverified.create({ userId: 'user-1', placeId: 'place-1', stars: 5 }),
    ).rejects.toMatchObject({ code: 'phone_unverified' });
    expect(repository.rows).toHaveLength(0);
    const verified = buildService(true);
    const created = await verified.create({ userId: 'user-1', placeId: 'place-1', stars: 4 });
    expect(created.status).toBe('held');
    await expect(
      verified.create({ userId: 'user-1', placeId: 'place-1', stars: 3 }),
    ).rejects.toMatchObject({ code: 'conflict' });
    expect(repository.rows).toHaveLength(1);
  });
});
