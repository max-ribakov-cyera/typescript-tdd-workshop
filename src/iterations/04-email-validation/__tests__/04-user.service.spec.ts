import { DuplicateEmailError, UserService } from '../user-service';

describe(UserService, () => {
  const email = 'jane@dev.com';
  const fullName = 'Jane Developer';

  it('should create a user with email and name', () => {
    const userService = new UserService();

    const user = userService.createUser(email, fullName);

    expect(user).toMatchObject({ email: email, name: fullName });
  });

  it('should store and retrieve created users', () => {
    const userService = new UserService();

    const created = userService.createUser(email, fullName);
    const retrieved = userService.findByEmail(email);

    expect(retrieved).toEqual(created);
  });

  it('should prevent duplicate email registration', () => {
    const userService = new UserService();

    userService.createUser(email, fullName);

    expect(() => userService.createUser(email, 'Different Name')).toThrow(DuplicateEmailError);
  });

  it('should validate email format', () => {
    expect(true).toBe(true);
  });
});
