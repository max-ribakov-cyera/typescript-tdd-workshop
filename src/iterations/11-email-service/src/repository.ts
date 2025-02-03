import { User } from './domain';

export interface UserServiceRepository {
  addUser(user: User): Promise<void>;

  updateUser(email: string, update: Partial<User>): Promise<void>;

  findUserByEmail(email: string): Promise<User | undefined>;

  findByPhoneNumber(phone: string): Promise<User | undefined>;
}

export class InMemoryUsersRepository implements UserServiceRepository {
  private usersByEmail: Map<string, User> = new Map();
  private usersByPhoneNumber: Map<string, User> = new Map();

  async addUser(user: User): Promise<void> {
    this.usersByEmail.set(user.email, user);
    this.usersByPhoneNumber.set(user.phoneNumber, user);
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.usersByEmail.get(email);
  }

  async findByPhoneNumber(phone: string): Promise<User | undefined> {
    return this.usersByPhoneNumber.get(phone);
  }

  async updateUser(email: string, partialUser: Partial<User>): Promise<void> {
    const user = await this.findUserByEmail(email);
    this.usersByEmail.set(email, { ...user!, ...partialUser });
    this.usersByPhoneNumber.set(user!.phoneNumber, { ...user!, ...partialUser });
  }
}
