import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';

@Injectable()
export class FirebaseConfigService extends BaseConfigService {
  get projectId(): string {
    return this.getValue<string>('firebase.projectId');
  }

  get isConfigured(): boolean {
    return this.projectId.length > 0;
  }
}
