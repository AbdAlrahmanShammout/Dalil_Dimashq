export interface CreateContactMessageInput {
  readonly name: string;
  readonly email: string | null;
  readonly phone: string | null;
  readonly type: string;
  readonly message: string;
  readonly visitorKey: string;
  readonly now: Date;
}

export interface ContactMessageItem {
  readonly id: string;
  readonly name: string;
  readonly email: string | null;
  readonly phone: string | null;
  readonly type: string;
  readonly message: string;
  readonly createdAt: Date;
}

export interface ContactMessagePage {
  readonly items: ContactMessageItem[];
  readonly total: number;
}

export abstract class ContactMessageRepository {
  abstract countSince(visitorKey: string, since: Date): Promise<number>;
  abstract create(input: CreateContactMessageInput): Promise<{ id: string }>;

  list(_limit: number, _offset: number): Promise<ContactMessagePage> {
    return Promise.resolve({ items: [], total: 0 });
  }
}
