export interface LegalText {
  readonly id: string;
  readonly kind: 'terms' | 'privacy';
  readonly language: 'ar' | 'en';
  readonly body: string;
}

export abstract class LegalRepository {
  abstract findCurrent(kind: 'terms' | 'privacy', language: 'ar' | 'en'): Promise<LegalText | null>;
}
