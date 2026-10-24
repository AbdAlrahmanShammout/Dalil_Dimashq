import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '@/config/base-config.service';

@Injectable()
export class MailConfigService extends BaseConfigService {
  get host(): string {
    return this.getValue<string>('mail.host');
  }

  get port(): number {
    return this.getValue<number>('mail.port');
  }

  get user(): string {
    return this.getValue<string>('mail.user');
  }

  get password(): string {
    return this.getValue<string>('mail.password');
  }

  get fromAddress(): string {
    return this.getValue<string>('mail.fromAddress');
  }

  get capture(): boolean {
    return this.getValue<boolean>('mail.capture');
  }
}
