import { AppController } from '@api-gateway/app/app.controller';
import { AppConfigModule } from '@api-gateway/config/config.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
