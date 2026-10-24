import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';

@Injectable()
export class GoogleAuthConfigService extends BaseConfigService {
  get clientId(): string {
    return this.getValue<string>('googleAuth.clientId');
  }

  get isConfigured(): boolean {
    return this.clientId.length > 0;
  }
}
