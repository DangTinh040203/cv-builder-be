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
import { EmailService } from '@/email/email.service';
import { AppStrategy } from '@/lib/constants/auth.constant';
import { CacheService } from '@/lib/utils/cache.service';
import { UtilsModule } from '@/lib/utils/utils.module';
import { Account, AccountSchema } from '@/user/entities/account.entity';
import { User, UserSchema } from '@/user/entities/user.entity';
import { ResumeService } from '@/user/services/resume.service';
import { UserService } from '@/user/services/user.service';
import { UserModule } from '@/user/user.module';

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
    ResumeService,
    AtStrategy,
    RtStrategy,
  ],
})
export class AuthModule {}
