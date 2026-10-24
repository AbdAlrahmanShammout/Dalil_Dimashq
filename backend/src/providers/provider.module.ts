import { Module } from '@nestjs/common';

import { AwsS3ProviderModule } from '@/providers/aws-s3/aws-s3-provider.module';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';
import { GoogleMapsProviderModule } from '@/providers/google-maps/google-maps-provider.module';

@Module({
  imports: [DatabaseProviderModule, AwsS3ProviderModule, GoogleMapsProviderModule],
  exports: [DatabaseProviderModule, AwsS3ProviderModule, GoogleMapsProviderModule],
})
export class ProviderModule {}
