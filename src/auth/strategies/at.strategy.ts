import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppStrategy } from '@/lib/constants/auth.constant';
import { Env } from '@/lib/constants/env.constant';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, AppStrategy.JWT) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get(Env.JWT_SECRET),
      ignoreExpiration: false,
    });
  }

  validate<T>(payload: T): T {
    return payload;
  }
}
