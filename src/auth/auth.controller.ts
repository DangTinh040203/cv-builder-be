import { Controller } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async signUpWithCredentials() {}

  async signInWithCredentials() {}

  async signInWithOAuth() {}

  async signOut() {}

  async refreshToken() {}

  async changePassword() {}

  async resetPassword() {}

  async verifyEmail() {}
}
