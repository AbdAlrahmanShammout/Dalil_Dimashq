import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AppConfigService } from '@/config/app/app-config.service';
import { CorsConfigService } from '@/config/cors/cors-config.service';
import { SwaggerProvider } from '@/providers/swagger/swagger.provider';

const JSON_BODY_LIMIT = '1mb';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  app.use(helmet());
  app.useBodyParser('json', { limit: JSON_BODY_LIMIT });
  app.useBodyParser('urlencoded', { extended: true, limit: JSON_BODY_LIMIT });
  const corsConfigService = app.get(CorsConfigService);
  app.enableCors({ origin: [...corsConfigService.origins], credentials: true });
  app.useGlobalPipes(new InputValidationPipe());
  SwaggerProvider.setupSwagger(app);
  await app.listen(app.get(AppConfigService).port);
}

void bootstrap();
