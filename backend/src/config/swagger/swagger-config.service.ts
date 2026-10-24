import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';

@Injectable()
export class SwaggerConfigService extends BaseConfigService {
  get isEnabled(): boolean {
    return this.getValue<boolean>('swagger.enabled');
  }
}
