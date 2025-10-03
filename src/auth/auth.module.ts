import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { UserOtp, userOtpSchema } from '@/auth/entities/user-otp.entity';
import { CacheService } from '@/common/utils/cache.service';
import { UtilsModule } from '@/common/utils/utils.module';
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
  providers: [AuthService, MongooseModule, CacheService],
})
export class AuthModule {}
