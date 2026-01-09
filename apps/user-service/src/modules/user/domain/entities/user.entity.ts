export interface User {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  email: string;
  provider: string;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
}
