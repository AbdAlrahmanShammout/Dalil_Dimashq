import { Injectable } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';

import { MailConfigService } from '@/config/mail/mail-config.service';
import { capturedMail } from '@/providers/mail/mail-capture';

export interface MailMessage {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
}

@Injectable()
export class MailManagerService {
  private transporter: Transporter | undefined;

  constructor(private readonly mailConfigService: MailConfigService) {}

  /**
   * Sends the visitor or owner signup code through Mailtrap.
   */
  async sendSignupCode(input: { readonly to: string; readonly code: string }): Promise<void> {
    await this.send({
      to: input.to,
      subject: 'Confirm your Dalil Dimashq email',
      text: `Your confirmation code is ${input.code}`,
    });
  }

  /**
   * Sends the shared-password reset code through Mailtrap.
   */
  async sendPasswordReset(input: { readonly to: string; readonly code: string }): Promise<void> {
    await this.send({
      to: input.to,
      subject: 'Reset your Dalil Dimashq password',
      text: `Your reset code is ${input.code}`,
    });
  }

  private async send(message: MailMessage): Promise<void> {
    if (this.mailConfigService.capture) {
      capturedMail.push(message);
      return;
    }
    await this.getTransporter().sendMail({
      from: this.mailConfigService.fromAddress,
      to: message.to,
      subject: message.subject,
      text: message.text,
    });
  }

  private getTransporter(): Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: this.mailConfigService.host,
        port: this.mailConfigService.port,
        auth: { user: this.mailConfigService.user, pass: this.mailConfigService.password },
      });
    }
    return this.transporter;
  }
}
