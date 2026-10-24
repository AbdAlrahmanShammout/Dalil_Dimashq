import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';
import { DEVELOPMENT_LIKE_ENVIRONMENTS, Environment } from '@/config/environment';

@Injectable()
export class AppConfigService extends BaseConfigService {
  get env(): Environment {
    return this.getValue<Environment>('app.env');
  }

  get port(): number {
    return this.getValue<number>('app.port');
  }

  get name(): string {
    return this.getValue<string>('app.name');
  }

  get isDevelopmentLike(): boolean {
    return DEVELOPMENT_LIKE_ENVIRONMENTS.includes(this.env);
  }
}
