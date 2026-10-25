import { PlaceService } from '@/modules/place/place.service';
import {
  CreateRatingRepoInput,
  RatingRecord,
  RatingRepository,
  RatingStatusName,
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

  async findById(id: string): Promise<RatingRecord | null> {
    return this.rows.find((row) => row.id === id) ?? null;
  }

  async listCounted(placeId: string): Promise<RatingRecord[]> {
    return this.rows.filter((row) => row.placeId === placeId && row.status === 'counted');
  }

  async markStatus(id: string, status: RatingStatusName): Promise<RatingRecord> {
    const index = this.rows.findIndex((row) => row.id === id);
    const next: RatingRecord = { ...this.rows[index], status };
    this.rows[index] = next;
    return next;
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

  it('changes the public score only when a rating is counted', async () => {
    const scores: Array<number | null> = [];
    const localRepository = new MemoryRatingRepository();
    const scoringPlace = {
      getPublicPlace: async (id: string) => ({ id }),
      applyVisitorScore: async (_placeId: string, starValue: number | null) => {
        scores.push(starValue);
      },
    } as unknown as PlaceService;
    const service = new RatingService(localRepository, scoringPlace, {
      hasVerifiedPhone: async () => true,
    } as unknown as UserService);
    const held = await service.create({ userId: 'user-1', placeId: 'place-1', stars: 4 });
    await service.rejectRating(held.id);
    expect(scores).toEqual([]);
    const counted = await service.create({ userId: 'user-2', placeId: 'place-1', stars: 5 });
    await service.countRating(counted.id);
    const other = await service.create({ userId: 'user-3', placeId: 'place-1', stars: 1 });
    await service.countRating(other.id);
    expect(scores).toEqual([5, 3]);
  });
});
