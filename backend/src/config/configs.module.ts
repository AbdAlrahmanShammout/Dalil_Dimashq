import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfigs from '@/config/app/app-configs';
import { AppConfigService } from '@/config/app/app-config.service';
import corsConfigs from '@/config/cors/cors-configs';
import { CorsConfigService } from '@/config/cors/cors-config.service';
import databaseConfigs from '@/config/database/database-configs';
import { DatabaseConfigService } from '@/config/database/database-config.service';
import jwtConfigs from '@/config/jwt/jwt-configs';
import { JwtConfigService } from '@/config/jwt/jwt-config.service';
import swaggerConfigs from '@/config/swagger/swagger-configs';
import { SwaggerConfigService } from '@/config/swagger/swagger-config.service';
import { validateEnvironment } from '@/config/validate-environment';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [...appConfigs, ...databaseConfigs, ...jwtConfigs, ...swaggerConfigs, ...corsConfigs],
      validate: validateEnvironment,
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
