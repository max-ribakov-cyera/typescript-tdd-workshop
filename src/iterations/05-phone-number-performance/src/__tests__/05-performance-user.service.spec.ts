import { UserService } from '../user-service';
import { DuplicateEmailError, InvalidEmailError } from '../errors';
import { User } from '../domain';
import { performance } from 'perf_hooks';
import { faker } from '@faker-js/faker';

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

    expect(maybeUser).toStrictEqual(created);
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

  it('should create a user with a phone number', () => {
    const userService = new UserService();
    const user = userService.createUser({
      name: 'user-with-phone',
      email,
      phoneNumber
    });
    expect(user).toMatchObject({ phoneNumber });
  });

  it('should create a user with a phone number and retrieve him by it', () => {
    const userService = new UserService();
    userService.createUser({
      name: 'user-with-phone',
      email,
      phoneNumber
    });

    const maybeUser = userService.findByPhoneNumber(phoneNumber);
    expect(maybeUser).toMatchObject({
      name: 'user-with-phone'
    });
  });

  describe.skip('performance of', () => {
    const userService = new UserService();
    const numOfUsers = 1000000;
    const numOfUsersToSearch = 1;

    const randomUsersToSearch = Array.from({ length: numOfUsersToSearch }, () => ({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      phoneNumber: faker.phone.number()
    }));

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
            const user: User = {
              email: faker.internet.email({ provider: `gmail${i + j}` }),
              name: `User ${i + j}`,
              phoneNumber: `${faker.phone.number()}-${i + j}`
            };
            return userService.createUser(user);
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
});
