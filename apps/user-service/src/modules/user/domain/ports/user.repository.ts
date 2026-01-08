import { type User } from '@user-service/modules/user/domain/entities/user.entity';

export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY_TOKEN';
export type UserMutationType = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export interface IUserRepository {
  create(user: Partial<UserMutationType>): Promise<User>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  update(id: string, updates: Partial<UserMutationType>): Promise<User>;
  delete(id: string): Promise<void>;
}
