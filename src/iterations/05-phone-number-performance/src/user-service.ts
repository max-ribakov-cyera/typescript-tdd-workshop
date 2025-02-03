import { DuplicateEmailError, InvalidEmailError } from './errors';
import { User } from './domain';

export class UserService {
  private users: User[] = [];

  createUser(user: User): User {
    const { email, phoneNumber } = user;

    if (!email.includes('@')) {
      throw new InvalidEmailError('Invalid email format, must contain @');
    }

    if (this.findByEmail(email)) {
      throw new DuplicateEmailError('Email already registered');
    }

    if (this.findByPhoneNumber(phoneNumber)) {
      throw new DuplicateEmailError('Phone number already registered');
    }

    this.users.push(user);
    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  findByPhoneNumber(phone: string): User | undefined {
    return this.users.find((user) => user.phoneNumber === phone);
  }
}
