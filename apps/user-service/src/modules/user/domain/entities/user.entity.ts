export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  provider: string;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
}
