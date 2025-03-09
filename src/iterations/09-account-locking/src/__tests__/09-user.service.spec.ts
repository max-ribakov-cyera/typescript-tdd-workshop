import { UserService } from '../user-service';
import { DuplicateEmailError, InvalidEmailError } from '../errors';
import { aUserCreationParams } from './builders';
import { faker } from '@faker-js/faker';
import { performance } from 'perf_hooks';
import { UserStatus } from '../domain';
import { InMemoryUsersRepository } from '../repository';
import { Logger, TslogLooger } from '../logger';
import { mock } from 'jest-mock-extended';

describe(UserService, () => {
  const logger = mock<Logger>();
  const userService = new UserService(new InMemoryUsersRepository(), logger);

  describe('product', () => {
    it('should create a user with email and name', () => {
      const user = userService.createUser(
        aUserCreationParams({ email: 'jane@dev.com', name: 'Jane Developer' })
      );

      expect(user).toMatchObject({ email: 'jane@dev.com', name: 'Jane Developer' });
    });

    it('should store and retrieve created users by email', () => {
      const created = userService.createUser(aUserCreationParams({ email: 'retrive@byEmail.com' }));
      const maybeUser = userService.findByEmail('retrive@byEmail.com');

      expect(maybeUser).toStrictEqual(created);
    });

    it('should prevent duplicate email registration', () => {
      userService.createUser(aUserCreationParams({ email: 'duplicate@email.com' }));

      expect(() =>
        userService.createUser(aUserCreationParams({ email: 'duplicate@email.com' }))
      ).toThrow(DuplicateEmailError);
    });

    it('should validate email format', () => {
      expect(() => userService.createUser(aUserCreationParams({ email: 'invalid-email' }))).toThrow(
        InvalidEmailError
      );
    });

    it('should create a user with a phone number and retrieve him by it', () => {
      userService.createUser(
        aUserCreationParams({ name: 'user-with-phone', phoneNumber: '555-555-5555' })
      );

      const maybeUser = userService.findByPhoneNumber('555-555-5555');
      expect(maybeUser).toMatchObject({
        name: 'user-with-phone'
      });
    });

    it('should create user with an address', () => {
      const user = userService.createUser(aUserCreationParams({ address: '123 Main St' }));
      expect(user).toMatchObject({ address: '123 Main St' });
    });

    it('should create user with status Pending and allow to update it', () => {
      const user = userService.createUser(aUserCreationParams({ email: 'pending@user.com' }));

      expect(user.status).toBe(UserStatus.PENDING);

      userService.activateUser(user.email);

      const maybeUser = userService.findByEmail('pending@user.com');
      expect(maybeUser).toMatchObject({ status: UserStatus.ACTIVE });
    });

    it('should allow to add logs', () => {
      const user = userService.createUser(aUserCreationParams());

      expect(logger.info).toHaveBeenCalledWith('User created', user);
    });

    it.skip('should allow users to login with password', () => {
      expect(true).toBe(false);
    });

    it.skip('should lock user account on the 3rd wrong password login attempt try for 5 minutes', () => {
      expect(true).toBe(false);
    });
  });

  describe.skip('performance of', () => {
    const numOfUsers = 100000;
    const numOfUsersToSearch = 10;

    const randomUsersToSearch = Array.from({ length: numOfUsersToSearch }, () =>
      aUserCreationParams({
        email: faker.internet.email(),
        phoneNumber: faker.phone.number()
      })
    );

    async function trackDuration(
      f: (time: number) => Promise<unknown>,
      times: number = 1
    ): Promise<number> {
      const start = performance.now();
      for (let i = 0; i < times; i++) {
        await f(i);
      }
      const end = performance.now();
      return end - start;
    }

    beforeAll(async () => {
      const timeToPopulate = await trackDuration(async () => {
        const chunkSize = 10000;
        const userPromises = [];
        for (let i = 0; i < numOfUsers; i += chunkSize) {
          const chunk = Array.from({ length: chunkSize }, (_, j) => {
            return userService.createUser(
              aUserCreationParams({
                email: faker.internet.email({ provider: `gmail${i + j}` }),
                phoneNumber: `${faker.phone.number()}-${i + j}`
              })
            );
          });
          userPromises.push(Promise.all(chunk));
        }

        randomUsersToSearch.forEach((user) => {
          userService.createUser(user);
        });

        await Promise.all(userPromises);
      });

      console.log('timeToPopulate:', timeToPopulate);
    });

    test(`findByEmail for ${numOfUsersToSearch} random users should be less than 5 milliseconds`, async () => {
      const durationByEmail = await trackDuration(
        async (index) => userService.findByEmail(randomUsersToSearch[index].email),
        numOfUsersToSearch
      );

      console.log('durationByEmail:', durationByEmail);
      expect(durationByEmail).toBeLessThan(5);
    });

    test(`findByPhoneNumber for ${numOfUsersToSearch} random users should be less than a 5 milliseconds`, async () => {
      const durationByPhone = await trackDuration(
        async (index) => userService.findByPhoneNumber(randomUsersToSearch[index].phoneNumber),
        numOfUsersToSearch
      );

      console.log('durationByPhone:', durationByPhone);
      expect(durationByPhone).toBeLessThan(5);
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

    it('should log user creation with ts logger', () => {
      const userServiceWithTslogLogger = new UserService(
        new InMemoryUsersRepository(),
        new TslogLooger()
      );
      userServiceWithTslogLogger.createUser(aUserCreationParams());

      expect(getConsoleLog()).toContain('User created');
    });
  });
});
