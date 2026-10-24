import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { DEFAULT_THROTTLE_LIMIT, DEFAULT_THROTTLE_TTL_MS } from '@/common/constants/throttle';
import { GlobalExceptionFilter } from '@/common/filter/global-exception.filter';
import { ValidationExceptionFilter } from '@/common/filter/validation-exception.filter';
import { AppThrottlerGuard } from '@/common/guards/app-throttler.guard';
import { AudienceGuard } from '@/common/guards/audience.guard';
import { AuthenticationGuard } from '@/common/guards/authentication.guard';
import { AuthorizationGuard } from '@/common/guards/authorization.guard';
import { ConfigsModule } from '@/config/configs.module';
import { HealthModule } from '@/health/health.module';
import { FeatureBundleModule } from '@/modules/feature-bundle.module';
import { ProviderModule } from '@/providers/provider.module';

@Module({
  imports: [
    ConfigsModule,
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: DEFAULT_THROTTLE_TTL_MS, limit: DEFAULT_THROTTLE_LIMIT }],
    }),
    ProviderModule,
    FeatureBundleModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_FILTER, useClass: ValidationExceptionFilter },
    { provide: APP_GUARD, useClass: AppThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    { provide: APP_GUARD, useClass: AudienceGuard },
    { provide: APP_GUARD, useClass: AuthorizationGuard },
  ],
})
export class AppModule {}
