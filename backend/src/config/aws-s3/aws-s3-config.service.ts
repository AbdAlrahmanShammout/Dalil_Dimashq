import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';

@Injectable()
export class AwsS3ConfigService extends BaseConfigService {
  get region(): string {
    return this.getValue<string>('awsS3.region');
  }

  get bucket(): string {
    return this.getValue<string>('awsS3.bucket');
  }

  get accessKeyId(): string {
    return this.getValue<string>('awsS3.accessKeyId');
  }

  get secretAccessKey(): string {
    return this.getValue<string>('awsS3.secretAccessKey');
  }

  get readTtlSeconds(): number {
    return this.getValue<number>('awsS3.readTtlSeconds');
  }

  get isConfigured(): boolean {
    return this.region.length > 0 && this.bucket.length > 0;
  }
}
