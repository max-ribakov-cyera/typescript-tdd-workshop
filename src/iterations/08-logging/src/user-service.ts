import { DuplicateEmailError, InvalidEmailError } from './errors';
import { User, UserCreationParams, UserStatus } from './domain';
import { InMemoryUsersRepository } from './repository';

export class UserService {
  constructor(private readonly repository: InMemoryUsersRepository) {}

  createUser(userCreationParams: UserCreationParams): User {
    const user = { ...userCreationParams, status: UserStatus.PENDING };
    const { email } = user;

    if (!email.includes('@')) {
      throw new InvalidEmailError('Invalid email format, must contain @');
    }

    if (this.findByEmail(email)) {
      throw new DuplicateEmailError('Email already registered');
    }

    this.repository.addUser(user);

    return user;
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
