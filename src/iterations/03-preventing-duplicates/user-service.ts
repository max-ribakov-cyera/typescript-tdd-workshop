export type User = {
  email: string;
  name: string;
};

export class UserService {
  private users: User[] = [];

  createUser(email: string, name: string): User {
    const user = { email, name };
    this.users.push(user);
    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }
}
