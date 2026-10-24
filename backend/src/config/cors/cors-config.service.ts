import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';

@Injectable()
export class CorsConfigService extends BaseConfigService {
  get origins(): readonly string[] {
    return this.getValue<string[]>('cors.origins');
  }
}
