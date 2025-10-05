import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { Model } from 'mongoose';

import { SignInDto } from '@/auth/dto/sign-in.dto';
import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { VerifyOtp } from '@/auth/dto/verify-otp-dto';
import { UserOtp } from '@/auth/entities/user-otp.entity';
import { OtpCreatedEvent, OtpEvent } from '@/auth/events/otp-created.event';
import { TokenService } from '@/auth/services/token.service';
import { Env } from '@/common/constants/env.constant';
import { CacheService } from '@/common/utils/cache.service';
import { UtilsService } from '@/common/utils/utils.service';
import { Account, AuthProvider } from '@/user/entities/account.entity';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(UserOtp.name) private userOtpModel: Model<UserOtp>,
    private readonly utilsService: UtilsService,
    private readonly cacheService: CacheService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}

  async signUpWithCredentials(body: SignUpDto) {
    const [userExist, accountExist] = await Promise.all([
      this.userService.findByEmail(body.email),
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

  async signInWithCredentials(body: SignInDto) {
    const accountHolder = await this.accountModel
      .findOne({
        email: body.email,
      })
      .lean();

    if (!accountHolder) {
      throw new NotFoundException('Account does not exist');
    }

    if (
      accountHolder.provider !== AuthProvider.credential ||
      !accountHolder.isVerified ||
      !accountHolder.password
    ) {
      throw new BadRequestException('Invalid sign-in method');
    }

    const validPassword = await compare(body.password, accountHolder.password);
    if (!validPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    const tokens = await this.tokenService.tokensGenerator(user._id.toString());
    return tokens;
  }

  async signInWithOAuth() {}

  async signOut() {}

  async refreshToken() {}

  async resetPassword() {}

  async verifyEmail(body: VerifyOtp) {
    const accountHolder = await this.accountModel
      .findOne({
        email: body.email,
      })
      .lean();

    if (!accountHolder) {
      throw new NotFoundException('Account does not exist');
    }

    if (accountHolder.isVerified) {
      throw new ConflictException('Account already verified');
    }

    const cacheKeyParts = ['Auth', 'Otp', body.email];
    const cachedOtp = await this.cacheService.get<string>(cacheKeyParts);

    if (cachedOtp) {
      if (cachedOtp !== body.otp) {
        throw new BadRequestException('Invalid OTP');
      }

      await Promise.all([
        this.cacheService.del(cacheKeyParts),
        this.userOtpModel.deleteOne({ email: body.email }),
        this.accountModel.updateOne(
          { email: body.email },
          { isVerified: true },
        ),
      ]);

      Logger.log(`Email ${body.email} verified successfully via cache`);
    } else {
      const userOtp = await this.userOtpModel
        .findOne({ email: body.email })
        .lean();

      if (!userOtp) {
        throw new BadRequestException('OTP expired or invalid');
      }

      if (userOtp.expiresAt < new Date()) {
        await this.userOtpModel.deleteOne({ email: body.email });
        throw new BadRequestException('OTP expired');
      }

      if (userOtp.otp !== body.otp) {
        throw new BadRequestException('Invalid OTP');
      }
    }

    await Promise.all([
      this.cacheService.del(cacheKeyParts),
      this.userOtpModel.deleteOne({ email: body.email }),
      this.accountModel.updateOne({ email: body.email }, { isVerified: true }),
      this.userService.createUser({
        avatar: this.configService.getOrThrow(Env.DEFAULT_USER_AVATAR),
        displayName: body.email.split('@')[0],
        email: body.email,
      }),
    ]);

    Logger.log(`Email ${body.email} verified successfully via DB`);
  }
}
