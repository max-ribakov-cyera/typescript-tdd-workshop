import { User } from './domain';

export class InMemoryUsersRepository {
  private usersByEmail: Map<string, User> = new Map();
  private usersByPhoneNumber: Map<string, User> = new Map();

  addUser(user: User): void {
    this.usersByEmail.set(user.email, user);
    this.usersByPhoneNumber.set(user.phoneNumber, user);
  }

  findUserByEmail(email: string): User | undefined {
    return this.usersByEmail.get(email);
  }

  findByPhoneNumber(phone: string): User | undefined {
    return this.usersByPhoneNumber.get(phone);
  }

  updateUser(email: string, partialUser: Partial<User>): void {
    const user = this.findUserByEmail(email);
    this.usersByEmail.set(email, { ...user!, ...partialUser });
    this.usersByPhoneNumber.set(user!.phoneNumber, { ...user!, ...partialUser });
  }
}
