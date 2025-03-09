import { UserService } from '../user-service';

describe(UserService, () => {
  it('should create a user with email and name', () => {
    const userService = new UserService();

    const user = userService.createUser('jane@dev.com', 'Jane Developer');

    expect(user).toMatchObject({ email: 'jane@dev.com', name: 'Jane Developer' });
  });

  it('should store and retrieve created users by email', () => {
    const userService = new UserService();

    const created = userService.createUser('jane@dev.com', 'Jane Developer');
    const retrieved = userService.findByEmail('jane@dev.com');

    expect(retrieved).toStrictEqual(created);
  });

  it.skip('should prevent duplicate email registration', () => {
    // const userService = new UserService();
    //
    // userService.createUser('jane@dev.com', 'Jane Developer');
    //
    // expect(() => userService.createUser('jane@dev.com', 'Different Name')).toThrow(
    //   DuplicateEmailError
    // );

    expect(true).toBe(false);
  });
});
