import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '@shared/contracts/user/dtos/create-user.dto';
import { User } from '@user-service/modules/user/domain/entities/user.entity';
import {
  type IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@user-service/modules/user/domain/ports/user.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly logger: Logger,
  ) {}

  createUser(user: CreateUserDto): Promise<User> {
    this.logger.log('Creating user', user);
    return this.userRepository.create(user);
  }
}
