import { UserService } from '../user-service';
import { DuplicateEmailError, InvalidEmailError } from '../errors';
import { aUser } from './builders';

describe(UserService, () => {
  const email = 'jane@dev.com';
  const name = 'Jane Developer';

  it('should create a user with email and name', () => {
    const userService = new UserService();

    const user = userService.createUser(aUser({ email, name }));

    expect(user).toMatchObject({ email, name });
  });

  it('should store and retrieve created users by email', () => {
    const userService = new UserService();

    const created = userService.createUser(aUser({ email }));
    const maybeUser = userService.findByEmail(email);

    expect(maybeUser).toStrictEqual(created);
  });

  it('should prevent duplicate email registration', () => {
    const userService = new UserService();

    userService.createUser(aUser({ email, name }));

    expect(() => userService.createUser(aUser({ email, name: 'Different Name' }))).toThrow(
      DuplicateEmailError
    );
  });

  it('should validate email format', () => {
    const userService = new UserService();

    expect(() => userService.createUser(aUser({ email: 'invalid-email' }))).toThrow(
      InvalidEmailError
    );
  });

  it('should create a user with a phone number and retrieve him by it', () => {
    const userService = new UserService();
    userService.createUser(aUser({ name: 'user-with-phone', phoneNumber: '555-555-5555' }));

    const maybeUser = userService.findByPhoneNumber('555-555-5555');
    expect(maybeUser).toMatchObject({
      name: 'user-with-phone'
    });
  });

  it('should create user with an address', () => {
    const userService = new UserService();
    const user = userService.createUser(
      aUser({ name: 'user-with-address', address: '123 Main St' })
    );
    expect(user).toMatchObject({ address: '123 Main St' });
  });
});
