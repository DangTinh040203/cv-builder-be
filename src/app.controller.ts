import { Controller, Get, HttpCode, HttpStatus, Version } from '@nestjs/common';

import { Public } from '@/auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('health')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
