import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { UserService } from '@/user/user.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { type Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getUserProfile(@Req() req: Request) {
    return this.userService.findById(req.user!._id);
  }
}
