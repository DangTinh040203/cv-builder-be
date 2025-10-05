import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { SignInDto } from '@/auth/dto/sign-in.dto';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { VerifyOtp } from '@/auth/dto/verify-otp-dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { AuthService } from '@/auth/services/auth.service';

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
  async signOut() {
    return this.authService.signOut();
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('refresh-token')
  async refreshToken() {
    return this.authService.refreshToken();
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('password/change')
  async changePassword() {
    return this.authService.changePassword();
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword() {
    return this.authService.resetPassword();
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  async verifyEmail(@Body() body: VerifyOtp) {
    return this.authService.verifyEmail(body);
  }
}
