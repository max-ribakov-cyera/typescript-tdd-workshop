export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active'
}

export type UserCreationParams = {
  email: string;
  name: string;
  phoneNumber: string;
  address: string;
};

export type User = {
  status: UserStatus;
} & UserCreationParams;
