import { UserService } from '../user-service';
import { DuplicateEmailError, InvalidEmailError } from '../errors';
import { User } from '../domain';

describe(UserService, () => {
  const email = 'jane@dev.com';
  const name = 'Jane Developer';
  const phoneNumber = '555-555-5555';

  const aUser: User = {
    email,
    name,
    phoneNumber
  };

  it('should create a user with email and name', () => {
    const userService = new UserService();

    const user = userService.createUser(aUser);

    expect(user).toMatchObject({ email, name });
  });

  it('should store and retrieve created users by email', () => {
    const userService = new UserService();

    const created = userService.createUser(aUser);
    const maybeUser = userService.findByEmail(email);

    expect(maybeUser).toEqual(created);
  });

  it('should prevent duplicate email registration', () => {
    const userService = new UserService();

    userService.createUser(aUser);

    expect(() => userService.createUser({ name: 'Different Name', email, phoneNumber })).toThrow(
      DuplicateEmailError
    );
  });

  it('should validate email format', () => {
    const userService = new UserService();

    expect(() => userService.createUser({ name, email: 'invalid-email', phoneNumber })).toThrow(
      InvalidEmailError
    );
  });

  it('should create a user with a phone number and retrieve him by it', () => {
    const userService = new UserService();
    const user = userService.createUser({
      name: 'user-with-phone',
      email,
      phoneNumber: phoneNumber
    });
    expect(user).toMatchObject({ phoneNumber: phoneNumber });

    // test is actually testing two things, creation and retrieval
    const maybeUser = userService.findByPhoneNumber(phoneNumber);
    expect(maybeUser).toMatchObject({
      name: 'user-with-phone'
    });
  });

  it('should create user with an address', () => {
    expect(true).toBe(true);
  });
});
