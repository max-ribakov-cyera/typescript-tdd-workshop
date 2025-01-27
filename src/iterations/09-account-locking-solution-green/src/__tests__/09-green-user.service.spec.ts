import { UserService } from '../user-service';
import { DuplicateEmailError, InvalidEmailError } from '../errors';
import { aUserCreationParams } from './builders';
import { UserStatus } from '../domain';
import { mock } from 'jest-mock-extended';
import { TslogLooger, Logger } from '../logger';

describe(UserService, () => {
  const logger = mock<Logger>();
  const userService = new UserService(logger);

  it('should create a user with email and name', async () => {
    const userCreationParams = aUserCreationParams();
    const user = await userService.createUser(userCreationParams);

    expect(user).toMatchObject({ email: userCreationParams.email, name: userCreationParams.name });
  });

  it('should store and retrieve created users by email', async () => {
    const email = 'email@retrieve.com';

    const created = await userService.createUser(aUserCreationParams({ email }));
    const maybeUser = userService.findByEmail(email);

    expect(maybeUser).toEqual(created);
  });

  it('should prevent duplicate email registration', async () => {
    const email = 'same@email.com';
    await userService.createUser(aUserCreationParams({ email, name: 'first user' }));

    await expect(
      userService.createUser(aUserCreationParams({ email, name: 'Different Name' }))
    ).rejects.toThrow(DuplicateEmailError);
  });

  it('should validate email format', async () => {
    await expect(
      userService.createUser(aUserCreationParams({ email: 'invalid-email' }))
    ).rejects.toThrow(InvalidEmailError);
  });

  it('should create a user with a phone number and retrieve him by it', async () => {
    const user = await userService.createUser(
      aUserCreationParams({ name: 'user-with-phone', phoneNumber: '555-555-5555' })
    );
    expect(user).toMatchObject({ phoneNumber: '555-555-5555' });

    // test is actually testing two things, creation and retrieval
    const maybeUser = userService.findByPhoneNumber('555-555-5555');
    expect(maybeUser).toMatchObject({
      name: 'user-with-phone'
    });
  });

  it('should create user with an address', async () => {
    const user = await userService.createUser(
      aUserCreationParams({ name: 'user-with-address', address: '123 Main St' })
    );
    expect(user).toMatchObject({ address: '123 Main St' });
  });

  it('should create user with status Pending and allow to update it', async () => {
    const email = 'email@thatWillPend.com';
    const user = await userService.createUser(aUserCreationParams({ email }));

    expect(user.status).toBe(UserStatus.PENDING);

    userService.activateUser(user.email);

    const maybeUser = userService.findByEmail(email);
    expect(maybeUser).toMatchObject({ status: UserStatus.ACTIVE });
  });

  it('should allow to add logs', async () => {
    const user = await userService.createUser(aUserCreationParams());

    expect(logger.info).toHaveBeenCalledWith('User created', user);
  });

  it('learning test just to see how tslog looks', async () => {
    const userServiceWithTslogLogger = new UserService(new TslogLooger());
    await userServiceWithTslogLogger.createUser(aUserCreationParams());
    expect(true).toBe(true);
  });

  it('should allow users to login with password', async () => {
    const email = 'with@password.com';
    const password = 'my-secret-password';
    await userService.createUser(aUserCreationParams({ email, password: password }));

    await expect(userService.login(email, 'not-my-secret-password')).resolves.toBe(
      'Invalid password'
    );

    await expect(userService.login(email, password)).resolves.toBe('Great Success');
  });

  it('should lock user account on the 3rd wrong password login attempt try for 5 minutes', async () => {
    jest.useFakeTimers();

    const email = 'forgot-my@password.com';
    const password = 'my-secret-password';
    const wrongPassword = 'wrong-password';

    await userService.createUser(aUserCreationParams({ email, password }));

    await userService.login(email, wrongPassword);
    await userService.login(email, wrongPassword);
    await expect(userService.login(email, wrongPassword)).resolves.toBe('User is locked');
    await expect(userService.login(email, password)).resolves.toBe('User is locked');

    jest.advanceTimersByTime(1000 * 60 * 6);

    await expect(userService.login(email, password)).resolves.toBe('Great Success');
  });

  it.skip('@@CHALLENGE@@ should lock user account on the 3rd wrong password login attempt try for 5 minutes without jest.useFakeTimers', async () => {
    expect(true).toBe(false);
  });
});
