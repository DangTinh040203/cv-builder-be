import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '@shared/contracts/user/dtos/create-user.dto';
import { User } from '@user-service/common/types/user.type';

@Injectable()
export class UserService {
  constructor(private readonly logger: Logger) {}

  createUser(user: CreateUserDto): Promise<User> {
    this.logger.log('Creating user', user);
    throw new BadGatewayException();
  }
}
