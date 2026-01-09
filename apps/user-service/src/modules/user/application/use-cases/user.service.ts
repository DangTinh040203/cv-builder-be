import { Inject, Injectable } from '@nestjs/common';
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
  ) {}

  createUser(user: CreateUserDto): Promise<User> {
    return this.userRepository.create(user);
  }
}
