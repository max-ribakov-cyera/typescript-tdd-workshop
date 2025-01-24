export type User = {
  email: string;
  name: string;
};

export class DuplicateEmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateEmailError';
    Object.setPrototypeOf(this, DuplicateEmailError.prototype);
  }
}

export class UserService {
  private users: User[] = [];

  createUser(email: string, name: string): User {
    const user = { email, name };

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
