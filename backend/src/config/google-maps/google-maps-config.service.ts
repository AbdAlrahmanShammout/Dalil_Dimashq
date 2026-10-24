import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';

@Injectable()
export class GoogleMapsConfigService extends BaseConfigService {
  get apiKey(): string {
    return this.getValue<string>('googleMaps.apiKey');
  }

  get isConfigured(): boolean {
    return this.apiKey.length > 0;
  }
}
