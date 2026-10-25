export interface CreateContactMessageInput {
  readonly name: string;
  readonly email: string | null;
  readonly phone: string | null;
  readonly type: string;
  readonly message: string;
  readonly visitorKey: string;
  readonly now: Date;
}

export abstract class ContactMessageRepository {
  abstract countSince(visitorKey: string, since: Date): Promise<number>;
  abstract create(input: CreateContactMessageInput): Promise<{ id: string }>;
}
