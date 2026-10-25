export const SUGGESTION_KINDS = ['wrong_info', 'missing_place', 'closed_place', 'other'] as const;

export type SuggestionKind = (typeof SUGGESTION_KINDS)[number];

export interface CreateSuggestionInput {
  readonly name: string;
  readonly contact: string;
  readonly kind: SuggestionKind;
  readonly message: string;
  readonly placeId: string | null;
  readonly visitorKey: string;
  readonly now: Date;
}

export const SUGGESTION_STATUSES = ['open', 'done', 'dismissed'] as const;
export type SuggestionStatusName = (typeof SUGGESTION_STATUSES)[number];

export interface SuggestionQueueItem {
  readonly id: string;
  readonly name: string;
  readonly contact: string;
  readonly kind: string;
  readonly message: string;
  readonly placeId: string | null;
  readonly status: SuggestionStatusName;
  readonly createdAt: Date;
}

export interface SuggestionPage {
  readonly items: SuggestionQueueItem[];
  readonly total: number;
}

export abstract class SuggestionRepository {
  abstract countSince(visitorKey: string, since: Date): Promise<number>;
  abstract create(input: CreateSuggestionInput): Promise<{ id: string }>;

  list(_limit: number, _offset: number): Promise<SuggestionPage> {
    return Promise.resolve({ items: [], total: 0 });
  }

  setStatus(_id: string, _status: SuggestionStatusName): Promise<boolean> {
    return Promise.resolve(false);
  }

  deleteById(_id: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}
