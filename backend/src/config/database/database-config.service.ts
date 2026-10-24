import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';

@Injectable()
export class DatabaseConfigService extends BaseConfigService {
  get url(): string {
    return this.getValue<string>('database.url');
  }
}
