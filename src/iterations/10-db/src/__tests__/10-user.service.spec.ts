import { UserService } from '../user-service';
import { DuplicateEmailError, InvalidEmailError } from '../errors';
import { aUserCreationParams } from './builders';
import { UserStatus } from '../domain';
import { InMemoryUsersRepository } from '../repository';
import { Logger, TslogLooger } from '../logger';
import { mock } from 'jest-mock-extended';
import { TimeServer } from '../time-server';

describe(UserService, () => {
  const logger = mock<Logger>();
  const timeServer = mock<TimeServer>();
  const userService = new UserService(new InMemoryUsersRepository(), timeServer, logger);

  describe('product', () => {
    it('should create a user with email and name', async () => {
      const user = await userService.createUser(
        aUserCreationParams({ email: 'jane@dev.com', name: 'Jane Developer' })
      );

      expect(user).toMatchObject({ email: 'jane@dev.com', name: 'Jane Developer' });
    });

    it('should store and retrieve created users by email', async () => {
      const created = await userService.createUser(
        aUserCreationParams({ email: 'retrive@byEmail.com' })
      );
      const maybeUser = userService.findByEmail('retrive@byEmail.com');

      expect(maybeUser).toEqual(created);
    });

    it('should prevent duplicate email registration', async () => {
      await userService.createUser(aUserCreationParams({ email: 'duplicate@email.com' }));

      await expect(
        userService.createUser(aUserCreationParams({ email: 'duplicate@email.com' }))
      ).rejects.toThrow(DuplicateEmailError);
    });

    it('should validate email format', async () => {
      await expect(
        userService.createUser(aUserCreationParams({ email: 'invalid-email' }))
      ).rejects.toThrow(InvalidEmailError);
    });

    it('should create a user with a phone number and retrieve him by it', async () => {
      await userService.createUser(
        aUserCreationParams({ name: 'user-with-phone', phoneNumber: '555-555-5555' })
      );

      const maybeUser = userService.findByPhoneNumber('555-555-5555');
      expect(maybeUser).toMatchObject({
        name: 'user-with-phone'
      });
    });

    it('should create user with an address', async () => {
      const user = await userService.createUser(aUserCreationParams({ address: '123 Main St' }));
      expect(user).toMatchObject({ address: '123 Main St' });
    });

    it('should create user with status Pending and allow to update it', async () => {
      const user = await userService.createUser(aUserCreationParams({ email: 'pending@user.com' }));

      expect(user.status).toBe(UserStatus.PENDING);

      userService.activateUser(user.email);

      const maybeUser = userService.findByEmail('pending@user.com');
      expect(maybeUser).toMatchObject({ status: UserStatus.ACTIVE });
    });

    it('should allow to add logs', async () => {
      const user = await userService.createUser(aUserCreationParams());

      expect(logger.info).toHaveBeenCalledWith('User created', user);
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

    it.skip('should lock user account on the 3rd wrong password login attempt try for 5 minutes', async () => {
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

    it('@@CHALLENGE@@ should lock user account on the 3rd wrong password login attempt try for 5 minutes without jest.useFakeTimers', async () => {
      const email = 'forgot-my@password-with-time-server.com';
      const password = 'my-secret-password';
      const wrongPassword = 'wrong-password';

      await userService.createUser(aUserCreationParams({ email, password }));

      const now = new Date(Date.now());
      timeServer.getCurrentTime.mockReturnValue(now);

      await userService.login(email, wrongPassword);
      await userService.login(email, wrongPassword);
      await expect(userService.login(email, wrongPassword)).resolves.toBe('User is locked');
      await expect(userService.login(email, password)).resolves.toBe('User is locked');

      timeServer.getCurrentTime.mockReturnValue(new Date(Date.now() + 1000 * 60 * 6));
      await expect(userService.login(email, password)).resolves.toBe('Great Success');
    });

    it.skip('should add db', () => {
      // change the set up to use a db
      expect(true).toBe(false);
    });
  });

  describe('logger learning tests', () => {
    let consoleOutput = '';

    function mockConsoleLog(resetConsoleOutput = false, printConsole = false): void {
      const storeLog = (inputs: unknown): void => {
        if (printConsole) {
          process.stdout.write('console.log: ' + inputs + '\n');
        }
        consoleOutput += inputs;
      };
      console['log'] = jest.fn(storeLog);
      if (resetConsoleOutput) {
        consoleOutput = '';
      }
    }

    function getConsoleLog(): string {
      return consoleOutput;
    }

    beforeEach(() => {
      mockConsoleLog(true, false);
    });

    it('should log user creation with ts logger', async () => {
      const userServiceWithTslogLogger = new UserService(
        new InMemoryUsersRepository(),
        mock<TimeServer>(),
        new TslogLooger()
      );
      await userServiceWithTslogLogger.createUser(aUserCreationParams());

      expect(getConsoleLog()).toContain('User created');
    });
  });
});
