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

  describe.skip('Performance Tests', () => {
    const userService = new UserService();
    const numOfUsers = 1000000;
    const numOfUsersToSearch = 1;

    const randomUsersToSearch = Array.from({ length: numOfUsersToSearch }, () => ({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      phoneNumber: faker.phone.number()
    }));

    beforeAll(async () => {
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

    function trackDuration(f: (time: number) => unknown, times: number = 1): number {
      const start = performance.now();
      for (let i = 0; i < times; i++) {
        f(i);
      }
      const end = performance.now();
      return end - start;
    }

    test(`findByEmail of ${numOfUsersToSearch} random users should be less than a millisecond`, () => {
      const durationByEmail = trackDuration(
        (index) => userService.findByEmail(randomUsersToSearch[index].email),
        numOfUsersToSearch
      );

      console.log('durationByEmail:', durationByEmail);
      expect(durationByEmail).toBeLessThan(5);
    });

    test(`findByPhoneNumber of ${numOfUsersToSearch} random users should be less than a millisecond`, () => {
      const durationByPhone = trackDuration(
        (index) => userService.findByPhoneNumber(randomUsersToSearch[index].phoneNumber),
        numOfUsersToSearch
      );

      console.log('durationByPhone:', durationByPhone);
      expect(durationByPhone).toBeLessThan(5);
    });
  });
});
