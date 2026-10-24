export const ApiAudience = {
  ClientApp: 'client-app',
  DashboardOwner: 'dashboard-owner',
  AdminPanel: 'admin-panel',
} as const;

export type ApiAudience = (typeof ApiAudience)[keyof typeof ApiAudience];

export interface Principal {
  readonly id: string;
  readonly audience: ApiAudience;
  readonly staffRole: string | null;
  readonly tokenVersion: number;
}
