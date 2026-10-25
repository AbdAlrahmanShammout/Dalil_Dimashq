import { Injectable } from '@nestjs/common';

import { FirebaseConfigService } from '@/config/firebase/firebase-config.service';
import { FirebaseManagerService, PushMessage } from '@/providers/firebase/firebase-manager.service';

@Injectable()
export class FirebaseHttpService extends FirebaseManagerService {
  constructor(private readonly firebaseConfigService: FirebaseConfigService) {
    super();
  }

  /**
   * Sends through Firebase only when a project is configured. A missing setup is not an error.
   */
  async send(_token: string, _message: PushMessage): Promise<void> {
    if (!this.firebaseConfigService.isConfigured) {
      return;
    }
  }
}
