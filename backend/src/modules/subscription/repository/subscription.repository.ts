export interface SubscriptionRecord {
  readonly id: string;
  readonly placeId: string;
  readonly endsAt: Date;
}

export abstract class SubscriptionRepository {
  create(_input: { placeId: string; endsAt: Date }): Promise<SubscriptionRecord | null> {
    return Promise.resolve(null);
  }

  updateEndsAt(_id: string, _endsAt: Date): Promise<SubscriptionRecord | null> {
    return Promise.resolve(null);
  }
}
