import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ResetPasswordDto } from '@/auth/dto/reset-password.dto';
import { SignInDto } from '@/auth/dto/sign-in.dto';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { VerifyOtp } from '@/auth/dto/verify-otp-dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { JwtAuthGuardRefreshJWT } from '@/auth/guards/refresh-jwt-auth.guard';
import { AuthService } from '@/auth/services/auth.service';
import { JwtPayload } from '@/common/types/express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up/credentials')
  async signUpWithCredentials(@Body() body: SignUpDto) {
    return this.authService.signUpWithCredentials(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in/credentials')
  async signInWithCredentials(@Body() body: SignInDto) {
    return this.authService.signInWithCredentials(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in/oauth')
  async signInWithOAuth() {
    return this.authService.signInWithOAuth();
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  async signOut(@Req() req: Express.Request) {
    return this.authService.signOut(req.user!._id);
  }

  @UseGuards(JwtAuthGuardRefreshJWT)
  @HttpCode(HttpStatus.CREATED)
  @Post('refresh-token')
  async refresh(@Req() req: Express.Request) {
    const user = req.user as JwtPayload & { refreshToken: string };
    return this.authService.refreshToken(user._id, user.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.email);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  async verifyEmail(@Body() body: VerifyOtp) {
    return this.authService.verifyEmail(body);
  }
}
