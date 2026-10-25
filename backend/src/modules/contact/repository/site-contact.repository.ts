export interface SiteContacts {
  readonly whatsapp?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly facebook?: string;
  readonly instagram?: string;
}

export abstract class SiteContactRepository {
  abstract read(): Promise<SiteContacts>;
}
