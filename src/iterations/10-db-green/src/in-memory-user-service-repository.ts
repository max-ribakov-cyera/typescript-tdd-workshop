import { User } from './domain';

export interface UserServiceRepository {
  addUser(user: User): Promise<void>;

  updateUser(user: User, update: Partial<User>): Promise<void>;

  findUserByEmail(email: string): Promise<User | undefined>;

  findByPhoneNumber(phone: string): Promise<User | undefined>;
}

export class InMemoryUserServiceRepository implements UserServiceRepository {
  private users: Map<string, User> = new Map();

  async addUser(user: User): Promise<void> {
    this.users.set(user.email, user);
  }

  async updateUser(user: User, update: Partial<User>): Promise<void> {
    const userFromDb = await this.findUserByEmail(user.email);
    if (!userFromDb) {
      throw new Error('User not found');
    }
    this.users.set(user.email, { ...userFromDb, ...update });
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.users.get(email);
  }

  async findByPhoneNumber(phone: string): Promise<User | undefined> {
    return [...this.users.values()].find((user) => user.phoneNumber === phone);
  }
}
