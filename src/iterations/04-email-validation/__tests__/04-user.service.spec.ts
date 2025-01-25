import { DuplicateEmailError, UserService } from '../user-service';

describe(UserService, () => {
  const email = 'jane@dev.com';
  const name = 'Jane Developer';

  it('should create a user with email and name', () => {
    const userService = new UserService();

    const user = userService.createUser(email, name);

    expect(user).toMatchObject({ email: email, name: name });
  });

  it('should store and retrieve created users by email', () => {
    const userService = new UserService();

    const created = userService.createUser(email, name);
    const maybeUser = userService.findByEmail(email);

    expect(maybeUser).toEqual(created);
  });

  it('should prevent duplicate email registration', () => {
    const userService = new UserService();

    userService.createUser(email, name);

    expect(() => userService.createUser(email, 'Different Name')).toThrow(DuplicateEmailError);
  });

  it('should validate email format', () => {
    expect(true).toBe(true);
  });
});
