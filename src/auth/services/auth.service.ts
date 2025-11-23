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
import { KeyStore } from '@/auth/entities/key-store.entity';
import { UserOtp } from '@/auth/entities/user-otp.entity';
import { OtpCreatedEvent, OtpEvent } from '@/auth/events/otp-created.event';
import { TokenService } from '@/auth/services/token.service';
import { Env } from '@/lib/constants/env.constant';
import {
  EDUCATION_SEED_DATA,
  EXPERIENCE_SEED_DATA,
  OVERVIEW_SEED_DATA,
  PROJECTS_SEED_DATA,
  RESUME_INFORMATION_SEED_DATA,
  SKILL_SEED_DATA,
  SUB_TITLE_SEED_DATA,
} from '@/lib/constants/resume.constant';
import { ResumeSection, SectionType } from '@/lib/types/resume.type';
import { CacheService } from '@/lib/utils/cache.service';
import { UtilsService } from '@/lib/utils/utils.service';
import { Account, AuthProvider } from '@/user/entities/account.entity';
import { ResumeService } from '@/user/services/resume.service';
import { UserService } from '@/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(UserOtp.name) private userOtpModel: Model<UserOtp>,
    @InjectModel(KeyStore.name) private keyStoreModel: Model<KeyStore>,
    private readonly utilsService: UtilsService,
    private readonly cacheService: CacheService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly resumeService: ResumeService,
    private readonly eventEmitter: EventEmitter2,
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

    await this.keyStoreModel.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $setOnInsert: {
          userId: user._id,
          refreshTokenUsed: [],
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return tokens;
  }

  async signInWithOAuth() {}

  async signOut(userId: string) {
    const deleted = await this.keyStoreModel.deleteOne({ userId });

    if (deleted.deletedCount === 0) {
      throw new NotFoundException('No active session found for this user');
    }

    Logger.log(`User ${userId} signed out successfully`);
  }

  async refreshToken(userId: string, refreshToken: string) {
    const keyStore = await this.keyStoreModel.findOne({ userId });

    if (!keyStore) {
      throw new NotFoundException('No key store found for this user');
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tokens = await this.tokenService.tokensGenerator(userId);

    await this.keyStoreModel.findOneAndUpdate(
      { userId },
      {
        $set: { refreshToken: tokens.refreshToken },
        $push: { refreshTokenUsed: refreshToken },
      },
    );

    Logger.log(`User ${userId} refreshed token successfully`);
    return tokens;
  }

  async resetPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cacheKeyParts = ['Auth', 'Otp', 'reset-password', user.email];
    const isReset = await this.cacheService.get<boolean>(cacheKeyParts);

    if (isReset) {
      throw new BadRequestException(
        'Password reset already requested. Please check your email.',
      );
    }

    const otp = this.utilsService.generateSecureOtp(6);
    const otpTtl = 5 * 60 * 1000; // 5 minutes

    await Promise.all([
      this.cacheService.set(cacheKeyParts, true, otpTtl),
      this.cacheService.set(['Auth', 'Otp', email], otp, otpTtl),
      this.userOtpModel.create({
        email: user.email,
        otp,
        expiresAt: new Date(Date.now() + otpTtl),
      }),
    ]);

    Logger.log(`OTP for ${cacheKeyParts.join(':')} - ${otp}`);
    this.eventEmitter.emit(
      OtpEvent.CREATED,
      new OtpCreatedEvent(user.email, otp),
    );
  }

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

    const [newUser] = await Promise.all([
      this.userService.createUser({
        avatar: this.configService.getOrThrow(Env.DEFAULT_USER_AVATAR),
        displayName: body.email.split('@')[0],
        email: body.email,
      }),
      this.cacheService.del(cacheKeyParts),
      this.userOtpModel.deleteOne({ email: body.email }),
      this.accountModel.updateOne({ email: body.email }, { isVerified: true }),
    ]);

    await this.resumeService.create({
      userId: newUser._id.toString(),
      title: newUser.displayName,
      subTitle: SUB_TITLE_SEED_DATA,
      avatar: newUser.avatar,
      overview: OVERVIEW_SEED_DATA,
      information: RESUME_INFORMATION_SEED_DATA,
      section: {
        educations: new ResumeSection(
          1,
          SectionType.EDUCATION,
          EDUCATION_SEED_DATA,
        ),
        workExperiences: new ResumeSection(
          2,
          SectionType.WORK_EXPERIENCE,
          EXPERIENCE_SEED_DATA,
        ),
        projects: new ResumeSection(3, SectionType.PROJECT, PROJECTS_SEED_DATA),
        skills: new ResumeSection(4, SectionType.SKILL, SKILL_SEED_DATA),
      },
    });

    Logger.log(`Email ${body.email} verified successfully via DB`);
  }
}
