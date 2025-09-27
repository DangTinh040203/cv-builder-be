import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async signUpWithCredentials() {}

  async signInWithCredentials() {}

  async signInWithOAuth() {}

  async signOut() {}

  async refreshToken() {}

  async changePassword() {}

  async resetPassword() {}

  async verifyEmail() {}
}
