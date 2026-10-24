import { Module } from '@nestjs/common';

import { ConfigsModule } from '@/config/configs.module';
import { HealthModule } from '@/health/health.module';
import { FeatureBundleModule } from '@/modules/feature-bundle.module';
import { ProviderModule } from '@/providers/provider.module';

@Module({
  imports: [ConfigsModule, ProviderModule, FeatureBundleModule, HealthModule],
})
export class AppModule {}
