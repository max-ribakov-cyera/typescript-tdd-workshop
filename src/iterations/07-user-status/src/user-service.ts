import { DuplicateEmailError, InvalidEmailError } from './errors';
import { User, UserRequest } from './domain';

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
}

export class UserService {
  constructor(private readonly repository: InMemoryUsersRepository) {}

  createUser(user: UserRequest): User {
    const { email } = user;

    if (!email.includes('@')) {
      throw new InvalidEmailError('Invalid email format, must contain @');
    }

    if (this.findByEmail(email)) {
      throw new DuplicateEmailError('Email already registered');
    }

    const createdUser = { ...user, status: 'pending' };
    this.repository.addUser(createdUser);

    return createdUser;
  }

  findByEmail(email: string): User | undefined {
    return this.repository.findUserByEmail(email);
  }

  findByPhoneNumber(phone: string): User | undefined {
    return this.repository.findByPhoneNumber(phone);
  }

  activateUser(email: string): User | undefined {
    const user = this.findByEmail(email);
    if (user) {
      user.status = 'active';
    }
    return user;
  }
}
