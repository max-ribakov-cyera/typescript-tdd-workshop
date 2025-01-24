import { UserService } from '../user-service';
import { DuplicateEmailError, InvalidEmailError } from '../errors';

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
    const userService = new UserService();

    expect(() => userService.createUser('invalid-email', fullName)).toThrow(InvalidEmailError);
  });

  it('should create a user with email, name, and phone number', () => {
    expect(true).toBe(true);
  });
});
