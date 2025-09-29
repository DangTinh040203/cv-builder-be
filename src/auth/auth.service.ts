import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';

import { SignUpDto } from '@/auth/dto/sign-up.dto';
import { UtilsService } from '@/common/utils/utils.service';
import { Account, AuthProvider } from '@/user/entities/account.entity';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly utilsService: UtilsService,
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
      provider: AuthProvider.local,
    });

    const otp = this.utilsService.generateSecureOtp(6);
  }

  async signInWithCredentials() {}

  async signInWithOAuth() {}

  async signOut() {}

  async refreshToken() {}

  async changePassword() {}

  async resetPassword() {}

  async verifyEmail() {}
}
