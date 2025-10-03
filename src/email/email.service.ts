import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Send email with dynamic template
   * @param to email recipient
   * @param subject subject line
   * @param templateName name of template file (without extension)
   * @param context dynamic variables injected into template
   */
  async sendTemplateEmail(to: string, subject: string, templateName: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: templateName, // e.g. 'otp', 'welcome', 'reset-password'
      });
      Logger.log(`✅ Email "${templateName}" sent to ${to}`);
    } catch (error) {
      Logger.error(`❌ Failed to send email to ${to}`, error);
      throw error;
    }
  }
}
