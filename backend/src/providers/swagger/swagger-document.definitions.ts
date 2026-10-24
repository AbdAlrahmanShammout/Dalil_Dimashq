import { Type } from '@nestjs/common';

import { HealthModule } from '@/health/health.module';
import { AdminPanelApiModule } from '@/modules/admin-panel-api.module';
import { ClientAppApiModule } from '@/modules/client-app-api.module';
import { DashboardOwnerApiModule } from '@/modules/dashboard-owner-api.module';
import { SWAGGER_UI_PATHS } from '@/providers/swagger/consts';

export interface SwaggerDocumentDefinition {
  readonly name: string;
  readonly titleSuffix: string;
  readonly description: string;
  readonly jsonPath: string;
  readonly include: readonly Type<unknown>[];
  readonly hasBearerAuth: boolean;
}

export const SWAGGER_DOCUMENT_DEFINITIONS: readonly SwaggerDocumentDefinition[] = [
  {
    name: 'client-app',
    titleSuffix: 'Client app',
    description: 'Mobile and website API',
    jsonPath: SWAGGER_UI_PATHS.clientApp,
    include: [ClientAppApiModule, HealthModule],
    hasBearerAuth: true,
  },
  {
    name: 'dashboard-owner',
    titleSuffix: 'Owner dashboard',
    description: 'Place owner API',
    jsonPath: SWAGGER_UI_PATHS.dashboardOwner,
    include: [DashboardOwnerApiModule, HealthModule],
    hasBearerAuth: true,
  },
  {
    name: 'admin-panel',
    titleSuffix: 'Admin panel',
    description: 'Staff API',
    jsonPath: SWAGGER_UI_PATHS.adminPanel,
    include: [AdminPanelApiModule, HealthModule],
    hasBearerAuth: true,
  },
];
