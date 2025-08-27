import { Module } from '@nestjs/common';

import { AppController } from '@/app.controller';
import { AppConfig } from '@/common/configs/app.config';
import { HealthController } from '@/health/health.controller';

@Module({
  imports: [...AppConfig],
  controllers: [AppController, HealthController],
  providers: [],
})
export class AppModule {}
