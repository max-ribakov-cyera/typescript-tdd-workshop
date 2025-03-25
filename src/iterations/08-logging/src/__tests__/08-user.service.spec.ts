import { UserService } from '../user-service';
import { DuplicateEmailError, InvalidEmailError } from '../errors';
import { aUserCreationParams } from './builders';
import { UserStatus } from '../domain';
import { InMemoryUsersRepository } from '../repository';

describe(UserService, () => {
  const userService = new UserService(new InMemoryUsersRepository());

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

    it.skip('should allow to add logs', () => {
      expect(true).toBe(false);
    });
  });
});
