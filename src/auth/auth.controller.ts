import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';
import { SignUpDto } from '@/auth/dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up/credentials')
  async signUpWithCredentials(@Body() body: SignUpDto) {
    return this.authService.signUpWithCredentials(body);
  }

  @Post('sign-in/credentials')
  async signInWithCredentials() {
    return this.authService.signInWithCredentials();
  }

  @Post('sign-in/oauth')
  async signInWithOAuth() {
    return this.authService.signInWithOAuth();
  }

  @Post('sign-out')
  async signOut() {
    return this.authService.signOut();
  }

  @Post('refresh-token')
  async refreshToken() {
    return this.authService.refreshToken();
  }

  @Post('password/change')
  async changePassword() {
    return this.authService.changePassword();
  }

  @Post('reset-password')
  async resetPassword() {
    return this.authService.resetPassword();
  }

  @Post('verify-email')
  async verifyEmail() {
    return this.authService.verifyEmail();
  }
}
