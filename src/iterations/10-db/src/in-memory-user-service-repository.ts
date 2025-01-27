import { User } from './domain';

export class InMemoryUserServiceRepository {
  private users: Map<string, User> = new Map();

  addUser(user: User): void {
    this.users.set(user.email, user);
  }

  updateUser(user: User, update: Partial<User>): void {
    const userFromDb = this.findUserByEmail(user.email);
    if (!userFromDb) {
      throw new Error('User not found');
    }
    this.users.set(user.email, { ...userFromDb, ...update });
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.get(email);
  }

  findByPhoneNumber(phone: string): User | undefined {
    return [...this.users.values()].find((user) => user.phoneNumber === phone);
  }
}
