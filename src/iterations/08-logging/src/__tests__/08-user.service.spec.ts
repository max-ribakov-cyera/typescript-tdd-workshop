import { UserService } from '../user-service';
import { DuplicateEmailError, InvalidEmailError } from '../errors';
import { aUserCreationParams } from './builders';
import { UserStatus } from '../domain';

describe(UserService, () => {
  const email = 'jane@dev.com';
  const name = 'Jane Developer';

  it('should create a user with email and name', () => {
    const userService = new UserService();

    const user = userService.createUser(aUserCreationParams({ email, name }));

    expect(user).toMatchObject({ email, name });
  });

  it('should store and retrieve created users by email', () => {
    const userService = new UserService();

    const created = userService.createUser(aUserCreationParams({ email }));
    const maybeUser = userService.findByEmail(email);

    expect(maybeUser).toEqual(created);
  });

  it('should prevent duplicate email registration', () => {
    const userService = new UserService();

    userService.createUser(aUserCreationParams({ email, name }));

    expect(() =>
      userService.createUser(aUserCreationParams({ email, name: 'Different Name' }))
    ).toThrow(DuplicateEmailError);
  });

  it('should validate email format', () => {
    const userService = new UserService();

    expect(() => userService.createUser(aUserCreationParams({ email: 'invalid-email' }))).toThrow(
      InvalidEmailError
    );
  });

  it('should create a user with a phone number and retrieve him by it', () => {
    const userService = new UserService();
    const user = userService.createUser(
      aUserCreationParams({ name: 'user-with-phone', phoneNumber: '555-555-5555' })
    );
    expect(user).toMatchObject({ phoneNumber: '555-555-5555' });

    // test is actually testing two things, creation and retrieval
    const maybeUser = userService.findByPhoneNumber('555-555-5555');
    expect(maybeUser).toMatchObject({
      name: 'user-with-phone'
    });
  });

  it('should create user with an address', () => {
    const userService = new UserService();
    const user = userService.createUser(
      aUserCreationParams({ name: 'user-with-address', address: '123 Main St' })
    );
    expect(user).toMatchObject({ address: '123 Main St' });
  });

  it('should create user with status Pending and allow to update it', () => {
    const userService = new UserService();
    const user = userService.createUser(aUserCreationParams({ email, name }));

    expect(user.status).toBe(UserStatus.PENDING);

    userService.activateUser(user.email);

    const maybeUser = userService.findByEmail(email);
    expect(maybeUser).toMatchObject({ status: UserStatus.ACTIVE });
  });

  it.skip('should allow to add logs', () => {
    expect(true).toBe(false);
  });
});
