import { Injectable } from '@nestjs/common';

import {
  SignUpResult,
  SignUpServiceInput,
  VerifyEmailServiceInput,
} from '@/modules/user/defs/user.defs';
import { EmailCodePurpose } from '@/modules/user/enum/general.enum';
import { UserService } from '@/modules/user/user.service';
import { MailManagerService } from '@/providers/mail/mail-manager.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailManagerService: MailManagerService,
  ) {}

  /**
   * Opens one door and sends the signup code when the email is not confirmed yet.
   */
  async signUp(input: SignUpServiceInput): Promise<Pick<SignUpResult, 'status'>> {
    const result = await this.userService.signUp(input);
    if (result.code) {
      await this.mailManagerService.sendSignupCode({ to: result.email, code: result.code });
    }
    return { status: result.status };
  }

  async verifyEmail(input: Omit<VerifyEmailServiceInput, 'purpose'>): Promise<void> {
    await this.userService.verifyEmail({ ...input, purpose: EmailCodePurpose.Signup });
  }
}
