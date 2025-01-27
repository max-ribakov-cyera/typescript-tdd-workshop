import { DuplicateEmailError, InvalidEmailError } from './errors';
import { User, UserCreationParams, UserStatus } from './domain';

export class UserService {
  private users: Map<string, User> = new Map();

  createUser(userCreationParams: UserCreationParams): User {
    const user = { ...userCreationParams, status: UserStatus.PENDING };
    const { email } = user;

    if (!email.includes('@')) {
      throw new InvalidEmailError('Invalid email format, must contain @');
    }

    if (this.findByEmail(email)) {
      throw new DuplicateEmailError('Email already registered');
    }
    this.users.set(email, user);
    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.get(email);
  }

  findByPhoneNumber(phone: string): User | undefined {
    return [...this.users.values()].find((user) => user.phoneNumber === phone);
  }

  activateUser(email: string): void {
    const user = this.findByEmail(email);
    if (user) {
      this.users.set(email, { ...user, status: UserStatus.ACTIVE });
    }
  }
}
