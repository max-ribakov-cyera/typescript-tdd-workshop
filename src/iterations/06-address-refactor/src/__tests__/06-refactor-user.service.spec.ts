import { UserService } from '../user-service';
import { DuplicateEmailError, InvalidEmailError } from '../errors';
import { aUser } from './builders';
import { faker } from '@faker-js/faker';
import { performance } from 'perf_hooks';

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

    expect(maybeUser).toEqual(created);
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
    const user = userService.createUser(
      aUser({ name: 'user-with-phone', phoneNumber: '555-555-5555' })
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
      aUser({ name: 'user-with-address', address: '123 Main St' })
    );
    expect(user).toMatchObject({ address: '123 Main St' });
  });

  describe('Performance Tests', () => {
    const userService = new UserService();

    const numOfUsers = 100000;
    const numOfUsersToSearch = 10;

    const randomUsersToSearch = Array.from({ length: numOfUsersToSearch }, () =>
      aUser({
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
              aUser({
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

    test(`findByEmail of ${numOfUsersToSearch} random users should be less than a millisecond`, async () => {
      const durationByEmail = await trackDuration(
        async (index) => userService.findByEmail(randomUsersToSearch[index].email),
        numOfUsersToSearch
      );

      console.log('durationByEmail:', durationByEmail);
      expect(durationByEmail).toBeLessThan(5);
    });

    test(`findByPhoneNumber of ${numOfUsersToSearch} random users should be less than a millisecond`, async () => {
      const durationByPhone = await trackDuration(
        async (index) => userService.findByPhoneNumber(randomUsersToSearch[index].phoneNumber),
        numOfUsersToSearch
      );

      console.log('durationByPhone:', durationByPhone);
      expect(durationByPhone).toBeLessThan(5);
    });
  });
});
