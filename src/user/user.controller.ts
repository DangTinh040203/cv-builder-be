import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ResumeService } from '@/user/services/resume.service';
import { UserService } from '@/user/services/user.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly resumeService: ResumeService,
  ) {}

  @Get('profile')
  async getUserProfile(@Req() req: Request) {
    return this.userService.findById(req.user!._id);
  }

  @Get('resume')
  async getUserResume(@Req() req: Request) {
    return this.resumeService.get(req.user!._id);
  }
}
