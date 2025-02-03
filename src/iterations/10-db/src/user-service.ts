import { DuplicateEmailError, InvalidEmailError } from './errors';
import { User, UserCreationParams, UserStatus } from './domain';
import { Logger } from './logger';
import bcrypt from 'bcrypt';
import { InMemoryUsersRepository } from './repository';
import { TimeServer } from './time-server';

export class UserService {
  constructor(
    private readonly repository: InMemoryUsersRepository,
    private readonly timeServer: TimeServer,
    private readonly logger: Logger
  ) {}

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

    this.repository.addUser(user);

    this.logger.info('User created', user);
    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = this.findByEmail(email);
    if (!user) {
      return 'User not found';
    }

    const currentTime = this.timeServer.getCurrentTime();

    if (user.failedLoginAttempts >= 3) {
      if (user.userLockExpiration !== undefined && user.userLockExpiration > currentTime) {
        return 'User is locked';
      } else {
        this.repository.updateUser(email, {
          failedLoginAttempts: 0,
          userLockExpiration: undefined
        });
      }
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordCorrect) {
      this.repository.updateUser(email, { failedLoginAttempts: user.failedLoginAttempts + 1 });

      if (user.failedLoginAttempts === 2) {
        const userLockExpiration = new Date(currentTime.getTime() + 1000 * 60 * 5);
        this.repository.updateUser(email, {
          userLockExpiration
        });
        return 'User is locked';
      }

      return 'Invalid password';
    }

    return 'Great Success';
  }

  findByEmail(email: string): User | undefined {
    return this.repository.findUserByEmail(email);
  }

  findByPhoneNumber(phone: string): User | undefined {
    return this.repository.findByPhoneNumber(phone);
  }

  activateUser(email: string): void {
    this.repository.updateUser(email, { status: UserStatus.ACTIVE });
  }
}
