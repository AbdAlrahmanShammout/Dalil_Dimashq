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

export abstract class SuggestionRepository {
  abstract countSince(visitorKey: string, since: Date): Promise<number>;
  abstract create(input: CreateSuggestionInput): Promise<{ id: string }>;
}
