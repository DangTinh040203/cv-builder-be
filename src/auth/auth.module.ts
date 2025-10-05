import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from '@/auth/auth.controller';
import { UserOtp, userOtpSchema } from '@/auth/entities/user-otp.entity';
import { OtpListener } from '@/auth/listeners/otp.listener';
import { AuthService } from '@/auth/services/auth.service';
import { TokenService } from '@/auth/services/token.service';
import { CacheService } from '@/common/utils/cache.service';
import { UtilsModule } from '@/common/utils/utils.module';
import { EmailService } from '@/email/email.service';
import { Account, AccountSchema } from '@/user/entities/account.entity';
import { KeyToken, keyTokenSchema } from '@/user/entities/key-token.entity';
import { User, UserSchema } from '@/user/entities/user.entity';

@Module({
  imports: [
    UtilsModule,
    MongooseModule.forFeature([
      { name: KeyToken.name, schema: keyTokenSchema },
      { name: Account.name, schema: AccountSchema },
      { name: User.name, schema: UserSchema },
      { name: UserOtp.name, schema: userOtpSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MongooseModule,
    CacheService,
    OtpListener,
    EmailService,
    TokenService,
  ],
})
export class AuthModule {}
