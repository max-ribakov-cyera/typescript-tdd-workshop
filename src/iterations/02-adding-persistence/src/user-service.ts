export type User = {
  email: string;
  name: string;
};

export class UserService {
  createUser(email: string, name: string): User {
    return { email, name };
  }
}
