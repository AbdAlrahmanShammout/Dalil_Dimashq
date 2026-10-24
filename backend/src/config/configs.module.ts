import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import appConfigs from '@/config/app/app-configs';
import { appConfigSchema } from '@/config/app/app-config.schema';
import { AppConfigService } from '@/config/app/app-config.service';
import corsConfigs from '@/config/cors/cors-configs';
import { corsConfigSchema } from '@/config/cors/cors-config.schema';
import { CorsConfigService } from '@/config/cors/cors-config.service';
import databaseConfigs from '@/config/database/database-configs';
import { databaseConfigSchema } from '@/config/database/database-config.schema';
import { DatabaseConfigService } from '@/config/database/database-config.service';
import jwtConfigs from '@/config/jwt/jwt-configs';
import { jwtConfigSchema } from '@/config/jwt/jwt-config.schema';
import { JwtConfigService } from '@/config/jwt/jwt-config.service';
import swaggerConfigs from '@/config/swagger/swagger-configs';
import { swaggerConfigSchema } from '@/config/swagger/swagger-config.schema';
import { SwaggerConfigService } from '@/config/swagger/swagger-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [...appConfigs, ...databaseConfigs, ...jwtConfigs, ...swaggerConfigs, ...corsConfigs],
      validationSchema: Joi.object({
        ...appConfigSchema,
        ...databaseConfigSchema,
        ...jwtConfigSchema,
        ...swaggerConfigSchema,
        ...corsConfigSchema,
      }),
      validationOptions: { abortEarly: false, allowUnknown: false },
    }),
  ],
  providers: [
    AppConfigService,
    DatabaseConfigService,
    JwtConfigService,
    SwaggerConfigService,
    CorsConfigService,
  ],
  exports: [
    AppConfigService,
    DatabaseConfigService,
    JwtConfigService,
    SwaggerConfigService,
    CorsConfigService,
  ],
})
export class ConfigsModule {}
