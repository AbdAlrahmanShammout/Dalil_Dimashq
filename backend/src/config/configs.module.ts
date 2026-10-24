import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfigs from '@/config/app/app-configs';
import { AppConfigService } from '@/config/app/app-config.service';
import awsS3Configs from '@/config/aws-s3/aws-s3-configs';
import { AwsS3ConfigService } from '@/config/aws-s3/aws-s3-config.service';
import corsConfigs from '@/config/cors/cors-configs';
import { CorsConfigService } from '@/config/cors/cors-config.service';
import databaseConfigs from '@/config/database/database-configs';
import { DatabaseConfigService } from '@/config/database/database-config.service';
import googleMapsConfigs from '@/config/google-maps/google-maps-configs';
import mailConfigs from '@/config/mail/mail-configs';
import { MailConfigService } from '@/config/mail/mail-config.service';
import { GoogleMapsConfigService } from '@/config/google-maps/google-maps-config.service';
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
      load: [
        ...appConfigs,
        ...databaseConfigs,
        ...jwtConfigs,
        ...swaggerConfigs,
        ...corsConfigs,
        ...awsS3Configs,
        ...googleMapsConfigs,
        ...mailConfigs,
      ],
      validate: validateEnvironment,
    }),
  ],
  providers: [
    AppConfigService,
    DatabaseConfigService,
    JwtConfigService,
    SwaggerConfigService,
    CorsConfigService,
    AwsS3ConfigService,
    GoogleMapsConfigService,
    MailConfigService,
  ],
  exports: [
    AppConfigService,
    DatabaseConfigService,
    JwtConfigService,
    SwaggerConfigService,
    CorsConfigService,
    AwsS3ConfigService,
    GoogleMapsConfigService,
    MailConfigService,
  ],
})
export class ConfigsModule {}
