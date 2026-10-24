import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { SwaggerDocumentDefinition } from '@/providers/swagger/swagger-document.definitions';

export function createSwaggerDocument(
  app: INestApplication,
  definition: SwaggerDocumentDefinition,
): OpenAPIObject {
  const builder = new DocumentBuilder()
    .setTitle(`Dalil Dimashq — ${definition.titleSuffix}`)
    .setDescription(definition.description)
    .setVersion('1');
  if (definition.hasBearerAuth) {
    builder.addBearerAuth();
  }
  return SwaggerModule.createDocument(app, builder.build(), {
    include: [...definition.include],
  });
}
