import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { OtpCreatedEvent, OtpEvent } from '@/auth/events/otp-created.event';
import { EmailService } from '@/email/email.service';

@Injectable()
export class OtpListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(OtpEvent.CREATED)
  async handleOtpCreated(event: OtpCreatedEvent) {
    await this.emailService.sendTemplateEmail(
      event.email,
      `Your OTP Code - ${event.otp}`,
      'otp',
    );
  }
}
