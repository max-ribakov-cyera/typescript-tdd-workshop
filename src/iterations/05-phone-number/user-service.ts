import { DuplicateEmailError, InvalidEmailError } from './errors';

export type User = {
  email: string;
  name: string;
};

export class UserService {
  private users: User[] = [];

  createUser(email: string, name: string): User {
    const user = { email, name };

    if (!email.includes('@')) {
      throw new InvalidEmailError('Invalid email format, must contain @');
    }

    if (this.findByEmail(email)) {
      throw new DuplicateEmailError('Email already registered');
    }
    this.users.push(user);
    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }
}
