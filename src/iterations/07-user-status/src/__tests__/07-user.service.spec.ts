import { InMemoryUsersRepository, UserService } from '../user-service';
import { DuplicateEmailError, InvalidEmailError } from '../errors';
import { aUserRequest } from './builders';
import { faker } from '@faker-js/faker';
import { performance } from 'perf_hooks';

describe(UserService, () => {
  const userService = new UserService(new InMemoryUsersRepository());

  describe('product', () => {
    it('should create a user with email and name', () => {
      const user = userService.createUser(
        aUserRequest({ email: 'jane@dev.com', name: 'Jane Developer' })
      );

      expect(user).toMatchObject({ email: 'jane@dev.com', name: 'Jane Developer' });
    });

    it('should store and retrieve created users by email', () => {
      const created = userService.createUser(aUserRequest({ email: 'retrive@byEmail.com' }));
      const maybeUser = userService.findByEmail('retrive@byEmail.com');

      expect(maybeUser).toStrictEqual(created);
    });

    it('should prevent duplicate email registration', () => {
      userService.createUser(aUserRequest({ email: 'duplicate@email.com' }));

      expect(() => userService.createUser(aUserRequest({ email: 'duplicate@email.com' }))).toThrow(
        DuplicateEmailError
      );
    });

    it('should validate email format', () => {
      expect(() => userService.createUser(aUserRequest({ email: 'invalid-email' }))).toThrow(
        InvalidEmailError
      );
    });

    it('should create a user with a phone number and retrieve him by it', () => {
      userService.createUser(
        aUserRequest({ name: 'user-with-phone', phoneNumber: '555-555-5555' })
      );

      const maybeUser = userService.findByPhoneNumber('555-555-5555');
      expect(maybeUser).toMatchObject({
        name: 'user-with-phone'
      });
    });

    it('should create user with an address', () => {
      const user = userService.createUser(aUserRequest({ address: '123 Main St' }));
      expect(user).toMatchObject({ address: '123 Main St' });
    });

    it('should create user with status Pending and allow to update it', () => {
      const user1 = userService.createUser(aUserRequest());
      expect(user1.status).toBe('pending');

      userService.activateUser(user1.email);
      expect(user1.status).toBe('active');
    });
  });
});
