export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active'
}

export type UserCreationParams = {
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  address: string;
};

export type User = {
  status: UserStatus;
  hashedPassword: string;
  failedLoginAttempts: number;
  userLockExpiration?: Date;
} & Omit<UserCreationParams, 'password'>;
