enum UserProvider {
  CLERK,
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  provider: UserProvider;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
}
