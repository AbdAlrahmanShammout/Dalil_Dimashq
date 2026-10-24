import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';

@Injectable()
export class JwtConfigService extends BaseConfigService {
  get accessSecret(): string {
    return this.getValue<string>('jwt.accessSecret');
  }

  get refreshSecret(): string {
    return this.getValue<string>('jwt.refreshSecret');
  }

  get accessTtlSeconds(): number {
    return this.getValue<number>('jwt.accessTtlSeconds');
  }

  get refreshTtlSeconds(): number {
    return this.getValue<number>('jwt.refreshTtlSeconds');
  }
}
