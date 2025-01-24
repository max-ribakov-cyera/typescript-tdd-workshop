import { UserService } from "../user-service";

describe('UserService', () => {
  it('should create a user with email and name', () => {
    const userService = new UserService();

    const user = userService.createUser('jane@dev.com', 'Jane Developer');

    expect(user.email).toBe('jane@dev.com');
    expect(user.name).toBe('Jane Developer');
  });
});