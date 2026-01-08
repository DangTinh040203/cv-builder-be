import { Env } from '@api-gateway/common/constants/env.constant';
import {
  Controller,
  Inject,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
  Post,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ServiceName } from '@shared/constants/service-name.constant';
import { ClerkUserWebhook } from '@shared/constants/webhook.constant';
import { CreateUserDto } from '@shared/contracts/user/dtos/create-user.dto';
import { ClerkWebhookPatterns } from '@shared/contracts/user/user.patterns';
import { ClerkWebhook } from '@shared/types/index';
import { Webhook } from 'svix';

@Controller('webhooks')
export class WebhooksController implements OnModuleInit {
  constructor(
    @Inject(ServiceName.USER_SERVICE)
    private readonly userClient: ClientProxy,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    await this.userClient.connect();
    this.logger.log('✅ USER_SERVICE client connected');
  }

  @Post('clerk')
  handleClerkWebhook(@Req() req) {
    try {
      const svixHeaders = {
        'svix-id': req.headers['svix-id'],
        'svix-timestamp': req.headers['svix-timestamp'],
        'svix-signature': req.headers['svix-signature'],
      };

      this.logger.debug('Svix headers:', svixHeaders);

      const wh = new Webhook(
        this.configService.getOrThrow(Env.CLERK_WEBHOOK_SECRET),
      );

      const payload = JSON.stringify(req.body);
      const evt = wh.verify(payload, svixHeaders) as ClerkWebhook;

      switch (evt.type) {
        case ClerkUserWebhook.USER_CREATED: {
          const clerkPayloadData = evt.data;
          const payload: CreateUserDto = {
            avatar: clerkPayloadData.image_url,
            provider: 'CLERK',
            email: clerkPayloadData.email_addresses[0].email_address,
            providerId: clerkPayloadData.id,
            firstName: clerkPayloadData.first_name,
            lastName: clerkPayloadData.last_name,
          };

          this.userClient.emit(ClerkWebhookPatterns.USER_CREATED, payload);
          this.logger.log(
            '✅ Event emitted successfully :',
            ClerkWebhookPatterns.USER_CREATED,
          );
          break;
        }

        default:
          break;
      }
    } catch (err) {
      this.logger.error('❌ Webhook verification failed:', err);
      throw new InternalServerErrorException();
    }
  }
}
