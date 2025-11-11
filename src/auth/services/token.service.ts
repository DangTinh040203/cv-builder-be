import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Env } from '@/lib/constants/env.constant';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async tokensGenerator(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { _id: userId },
        {
          secret: this.configService.get(Env.JWT_SECRET),
          expiresIn: this.configService.get(Env.JWT_EXPIRES_IN),
        },
      ),
      this.jwtService.signAsync(
        { _id: userId },
        {
          secret: this.configService.get(Env.JWT_REFRESH_SECRET),
          expiresIn: this.configService.get(Env.JWT_REFRESH_EXPIRES_IN),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
