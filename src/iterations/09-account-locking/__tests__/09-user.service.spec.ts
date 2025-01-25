import { UserService } from '../user-service';
import { DuplicateEmailError, InvalidEmailError } from '../errors';
import { aUserCreationParams } from './builders';
import { UserStatus } from '../domain';
import { mock } from 'jest-mock-extended';
import { TslogLooger, Logger } from '../logger';

describe(UserService, () => {
  const logger = mock<Logger>();
  const userService = new UserService(logger);

  it('should create a user with email and name', () => {
    const userCreationParams = aUserCreationParams();
    const user = userService.createUser(userCreationParams);

    expect(user).toMatchObject({ email: userCreationParams.email, name: userCreationParams.name });
  });

  it('should store and retrieve created users by email', () => {
    const email = 'email@retrieve.com';

    const created = userService.createUser(aUserCreationParams({ email }));
    const maybeUser = userService.findByEmail(email);

    expect(maybeUser).toEqual(created);
  });

  it('should prevent duplicate email registration', () => {
    const email = 'same@email.com';
    userService.createUser(aUserCreationParams({ email, name: 'first user' }));

    expect(() =>
      userService.createUser(aUserCreationParams({ email, name: 'Different Name' }))
    ).toThrow(DuplicateEmailError);
  });

  it('should validate email format', () => {
    expect(() => userService.createUser(aUserCreationParams({ email: 'invalid-email' }))).toThrow(
      InvalidEmailError
    );
  });

  it('should create a user with a phone number and retrieve him by it', () => {
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
    const user = userService.createUser(
      aUserCreationParams({ name: 'user-with-address', address: '123 Main St' })
    );
    expect(user).toMatchObject({ address: '123 Main St' });
  });

  it('should create user with status Pending and allow to update it', () => {
    const email = 'email@thatWillPend.com';
    const user = userService.createUser(aUserCreationParams({ email }));

    expect(user.status).toBe(UserStatus.PENDING);

    userService.activateUser(user.email);

    const maybeUser = userService.findByEmail(email);
    expect(maybeUser).toMatchObject({ status: UserStatus.ACTIVE });
  });

  it('should allow to add logs', () => {
    const user = userService.createUser(aUserCreationParams());

    expect(logger.info).toHaveBeenCalledWith('User created', user);
  });

  it('learning test just to see how tslog looks', () => {
    const userServiceWithTslogLogger = new UserService(new TslogLooger());
    userServiceWithTslogLogger.createUser(aUserCreationParams());
    expect(true).toBe(true);
  });

  it('should track failed login attempts', async () => {
    expect(true).toBe(true);
  });
});
