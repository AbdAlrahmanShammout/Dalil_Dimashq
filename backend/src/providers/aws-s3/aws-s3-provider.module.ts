import { Module } from '@nestjs/common';

import { AwsS3ManagerService } from '@/providers/aws-s3/aws-s3-manager.service';

@Module({
  providers: [AwsS3ManagerService],
  exports: [AwsS3ManagerService],
})
export class AwsS3ProviderModule {}
