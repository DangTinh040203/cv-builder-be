import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Inject, Post } from '@nestjs/common';

import { AuthService } from '@/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post('sign-up')
  async signUpWithCredentials() {
    const test = await this.cacheManager.set('key', 'value');
    return this.cacheManager.get('key');
  }

  async signInWithCredentials() {}

  async signInWithOAuth() {}

  async signOut() {}

  async refreshToken() {}

  async changePassword() {}

  async resetPassword() {}

  async verifyEmail() {}
}
