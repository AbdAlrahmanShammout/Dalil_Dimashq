import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import { AppConfigService } from '@/config/app/app-config.service';
import { SwaggerConfigService } from '@/config/swagger/swagger-config.service';
import { createSwaggerDocument } from '@/providers/swagger/swagger-document.factory';
import { SWAGGER_DOCUMENT_DEFINITIONS } from '@/providers/swagger/swagger-document.definitions';

export function isSwaggerEnabled(isDevelopmentLike: boolean, isEnabled: boolean): boolean {
  return isDevelopmentLike && isEnabled;
}

export class SwaggerProvider {
  static setupSwagger(app: INestApplication): void {
    const appConfigService = app.get(AppConfigService);
    const swaggerConfigService = app.get(SwaggerConfigService);
    if (!isSwaggerEnabled(appConfigService.isDevelopmentLike, swaggerConfigService.isEnabled)) {
      return;
    }
    for (const definition of SWAGGER_DOCUMENT_DEFINITIONS) {
      const document = createSwaggerDocument(app, definition);
      SwaggerModule.setup(definition.jsonPath, app, document);
    }
  }
}
