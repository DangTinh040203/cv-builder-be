import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';

import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { UserOtp } from '@/auth/entities/user-otp.entity';
import { OtpCreatedEvent, OtpEvent } from '@/auth/events/otp-created.event';
import { CacheService } from '@/common/utils/cache.service';
import { UtilsService } from '@/common/utils/utils.service';
import { Account, AuthProvider } from '@/user/entities/account.entity';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserOtp.name) private userOtpModel: Model<UserOtp>,
    private readonly utilsService: UtilsService,
    private readonly cacheService: CacheService,
    private eventEmitter: EventEmitter2,
  ) {}

  async signUpWithCredentials(body: SignUpDto) {
    const [userExist, accountExist] = await Promise.all([
      this.userModel.exists({ email: body.email }),
      this.accountModel.exists({ email: body.email }),
    ]);

    if (userExist || accountExist) {
      throw new ConflictException('Email already exists');
    }

    const SALT = 10;
    const hashedPassword = await hash(body.password, SALT);
    await this.accountModel.create({
      email: body.email,
      password: hashedPassword,
      provider: AuthProvider.credential,
    });

    const otp = this.utilsService.generateSecureOtp(6);
    const otpTtl = 5 * 60 * 1000; // 5 minutes

    const cacheKeyParts = ['Auth', 'Otp', body.email];

    await Promise.all([
      this.cacheService.set(cacheKeyParts, otp, otpTtl),
      this.userOtpModel.create({
        email: body.email,
        otp,
        expiresAt: new Date(Date.now() + otpTtl),
      }),
    ]);

    Logger.log(`OTP for ${cacheKeyParts.join(':')} - ${otp}`);

    this.eventEmitter.emit(
      OtpEvent.CREATED,
      new OtpCreatedEvent(body.email, otp),
    );
  }

  async signInWithCredentials() {}

  async signInWithOAuth() {}

  async signOut() {}

  async refreshToken() {}

  async changePassword() {}

  async resetPassword() {}

  async verifyEmail() {}
}
