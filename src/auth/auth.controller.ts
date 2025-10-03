import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { SignInDto } from '@/auth/dto/sign-in.dto';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { VerifyOtp } from '@/auth/dto/verify-otp-dto';

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

  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  async signOut() {
    return this.authService.signOut();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('refresh-token')
  async refreshToken() {
    return this.authService.refreshToken();
  }

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

  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  async verifyEmail(@Body() body: VerifyOtp) {
    return this.authService.verifyEmail(body);
  }
}
