import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@/auth/auth.controller';
import { KeyStore, keyStoreSchema } from '@/auth/entities/key-store.entity';
import { UserOtp, userOtpSchema } from '@/auth/entities/user-otp.entity';
import { OtpListener } from '@/auth/listeners/otp.listener';
import { AuthService } from '@/auth/services/auth.service';
import { TokenService } from '@/auth/services/token.service';
import { AtStrategy } from '@/auth/strategies/at.strategy';
import { RtStrategy } from '@/auth/strategies/rt.strategy';
import { AppStrategy } from '@/common/constants/auth.constant';
import { CacheService } from '@/common/utils/cache.service';
import { UtilsModule } from '@/common/utils/utils.module';
import { EmailService } from '@/email/email.service';
import { Account, AccountSchema } from '@/user/entities/account.entity';
import { User, UserSchema } from '@/user/entities/user.entity';
import { UserModule } from '@/user/user.module';
import { UserService } from '@/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: User.name, schema: UserSchema },
      { name: UserOtp.name, schema: userOtpSchema },
      { name: KeyStore.name, schema: keyStoreSchema },
    ]),
    UserModule,
    UtilsModule,
    PassportModule.register({
      defaultStrategy: AppStrategy.JWT,
      session: false,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MongooseModule,
    CacheService,
    OtpListener,
    EmailService,
    TokenService,
    UserService,
    AtStrategy,
    RtStrategy,
  ],
})
export class AuthModule {}
