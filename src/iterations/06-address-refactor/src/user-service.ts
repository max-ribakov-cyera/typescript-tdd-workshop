import { DuplicateEmailError, InvalidEmailError } from './errors';
import { User } from './domain';

export class UserService {
  private usersByEmail: Map<string, User> = new Map();
  private usersByPhoneNumber: Map<string, User> = new Map();

  createUser(user: User): User {
    const { email, phoneNumber } = user;

    if (!email.includes('@')) {
      throw new InvalidEmailError('Invalid email format, must contain @');
    }

    if (this.findByEmail(email)) {
      throw new DuplicateEmailError('Email already registered');
    }

    this.usersByEmail.set(email, user);
    this.usersByPhoneNumber.set(phoneNumber, user);

    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.usersByEmail.get(email);
  }

  findByPhoneNumber(phone: string): User | undefined {
    return this.usersByPhoneNumber.get(phone);
  }
}
