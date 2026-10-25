export interface AdminAlertItem {
  readonly id: string;
  readonly kind: string;
  readonly message: string;
  readonly targetId: string | null;
  readonly createdAt: Date;
}

export abstract class AdminAlertRepository {
  listUnread(): Promise<AdminAlertItem[]> {
    return Promise.resolve([]);
  }

  markRead(_id: string, _readAt: Date): Promise<'missing' | 'read' | 'saved'> {
    return Promise.resolve('missing');
  }

  countUnread(): Promise<number> {
    return Promise.resolve(0);
  }
}
