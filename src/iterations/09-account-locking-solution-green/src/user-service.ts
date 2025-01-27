import { DuplicateEmailError, InvalidEmailError } from './errors';
import { User, UserCreationParams, UserStatus } from './domain';
import { Logger } from './logger';
import bcrypt from 'bcrypt';

export class UserService {
  private users: Map<string, User> = new Map();

  constructor(private readonly logger: Logger) {}

  async createUser(userCreationParams: UserCreationParams): Promise<User> {
    const { password, ...commonUserProps } = userCreationParams;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = {
      ...commonUserProps,
      status: UserStatus.PENDING,
      hashedPassword,
      failedLoginAttempts: 0
    };
    const { email } = user;

    if (!email.includes('@')) {
      throw new InvalidEmailError('Invalid email format, must contain @');
    }

    if (this.findByEmail(email)) {
      throw new DuplicateEmailError('Email already registered');
    }
    this.users.set(email, user);

    this.logger.info('User created', user);
    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = this.findByEmail(email);
    if (!user) {
      return 'User not found';
    }

    if (user.failedLoginAttempts >= 3) {
      if (user.userLockExpiration && user.userLockExpiration > new Date()) {
        return 'User is locked';
      } else {
        this.users.set(email, { ...user, failedLoginAttempts: 0, userLockExpiration: undefined });
      }
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordCorrect) {
      const updatedUser = { ...user, failedLoginAttempts: user.failedLoginAttempts + 1 };
      this.users.set(email, updatedUser);

      if (user.failedLoginAttempts === 2) {
        this.users.set(email, {
          ...updatedUser,
          userLockExpiration: new Date(Date.now() + 1000 * 60 * 5)
        });
        return 'User is locked';
      }

      return 'Invalid password';
    }

    return 'Great Success';
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
