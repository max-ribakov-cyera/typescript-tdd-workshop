import { DuplicateEmailError, InvalidEmailError } from './errors';
import { User, UserCreationParams, UserStatus } from './domain';
import { Logger } from './logger';
import bcrypt from 'bcrypt';
import { UserServiceRepository } from './in-memory-user-service-repository';
import { TimeServer } from './time-server';

export class UserService {
  constructor(
    private readonly repository: UserServiceRepository,
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

    if (await this.findByEmail(email)) {
      throw new DuplicateEmailError('Email already registered');
    }

    await this.repository.addUser(user);

    this.logger.info('User created', user);
    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user) {
      return 'User not found';
    }

    const currentTime = this.timeServer.getCurrentTime();

    if (user.failedLoginAttempts >= 3) {
      if (user.userLockExpiration !== undefined && user.userLockExpiration > currentTime) {
        return 'User is locked';
      } else {
        await this.repository.updateUser(user, {
          failedLoginAttempts: 0,
          userLockExpiration: undefined
        });
      }
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordCorrect) {
      await this.repository.updateUser(user, { failedLoginAttempts: user.failedLoginAttempts + 1 });

      if (user.failedLoginAttempts === 2) {
        const userLockExpiration = new Date(currentTime.getTime() + 1000 * 60 * 5);
        await this.repository.updateUser(user, {
          userLockExpiration
        });
        return 'User is locked';
      }

      return 'Invalid password';
    }

    return 'Great Success';
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.repository.findUserByEmail(email);
  }

  async findByPhoneNumber(phone: string): Promise<User | undefined> {
    return await this.repository.findByPhoneNumber(phone);
  }

  async activateUser(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (user) {
      await this.repository.updateUser(user, { status: UserStatus.ACTIVE });
    }
  }
}
