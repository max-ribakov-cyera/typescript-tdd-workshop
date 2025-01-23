export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'locked';
  loginAttempts: number;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
