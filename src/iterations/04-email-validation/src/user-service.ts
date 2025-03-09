export type User = {
  email: string;
  name: string;
};

export class DuplicateEmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateEmailError';
  }
}

export class UserService {
  private users: User[] = [];

  createUser(email: string, name: string): User {
    if (this.findByEmail(email)) {
      throw new DuplicateEmailError(email);
    }

    const user = { email, name };
    this.users.push(user);
    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }
}
