import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  ping(): string {
    return 'pong from UserService';
  }

  getUser(id: string) {
    // TODO: Implement actual user retrieval from database
    return {
      id,
      name: 'Test User',
      email: 'test@example.com',
    };
  }
}
