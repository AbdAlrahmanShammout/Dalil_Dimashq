import { Injectable } from '@nestjs/common';

import { ApiAudience } from '@/common/auth/principal.interface';
import { AuthDoor } from '@/modules/user/enum/general.enum';
import { UserService } from '@/modules/user/user.service';
import { MailManagerService } from '@/providers/mail/mail-manager.service';

export const FORGOT_PASSWORD_CODE = 'forgot_password_sent';

@Injectable()
export class ForgetPasswordService {
  constructor(
    private readonly userService: UserService,
    private readonly mailManagerService: MailManagerService,
  ) {}

  /**
   * Always reports the same outcome. Mail is sent only when that door is open.
   */
  async requestReset(input: {
    readonly email: string;
    readonly audience: ApiAudience;
    readonly door: AuthDoor;
  }): Promise<{ readonly code: typeof FORGOT_PASSWORD_CODE }> {
    const result = await this.userService.createPasswordResetCode(input);
    if (result) {
      await this.mailManagerService.sendPasswordReset({ to: result.email, code: result.code });
    }
    return { code: FORGOT_PASSWORD_CODE };
  }

  async resetPassword(input: {
    readonly email: string;
    readonly code: string;
    readonly password: string;
    readonly audience: ApiAudience;
    readonly door: AuthDoor;
  }): Promise<void> {
    await this.userService.resetPassword(input);
  }
}
