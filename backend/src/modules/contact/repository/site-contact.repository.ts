export interface SiteContacts {
  readonly whatsapp?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly facebook?: string;
  readonly instagram?: string;
}

export abstract class SiteContactRepository {
  abstract read(): Promise<SiteContacts>;

  save(_input: SiteContacts): Promise<SiteContacts> {
    return Promise.reject(new Error('save is not implemented'));
  }
}
