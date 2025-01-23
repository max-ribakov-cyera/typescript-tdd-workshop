import { UserService } from '../user.service';
import { InMemoryUserRepository } from '../user.repository';
import { UserBuilder } from '../../utils/test-helpers/builders';
import { ValidationError, UserExistsError } from '../../core/errors';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    userService = new UserService(userRepository);
  });

  describe('createUser', () => {
    it('should create user with valid email', async () => {
      // Arrange
      const email = 'test@example.com';
      const role = 'user';

      // Act
      const user = await userService.createUser(email, role);

      // Assert
      expect(user.email).toBe(email);
      expect(user.role).toBe(role);
      expect(user.status).toBe('active');
      expect(user.loginAttempts).toBe(0);
    });

    it('should throw validation error for invalid email', async () => {
      // Arrange
      const invalidEmail = 'invalid-email';

      // Act & Assert
      await expect(
        userService.createUser(invalidEmail, 'user')
      ).rejects.toThrow(ValidationError);
    });

    it('should throw error for duplicate email', async () => {
      // Arrange
      const email = 'test@example.com';
      await userService.createUser(email, 'user');

      // Act & Assert
      await expect(
        userService.createUser(email, 'user')
      ).rejects.toThrow(UserExistsError);
    });
  });

  describe('recordFailedLogin', () => {
    it('should increment failed login attempts', async () => {
      // Arrange
      const user = await userService.createUser('test@example.com', 'user');

      // Act
      await userService.recordFailedLogin(user.id);

      // Assert
      const updated = await userRepository.findById(user.id);
      expect(updated?.loginAttempts).toBe(1);
    });

    it('should lock account after max attempts', async () => {
      // Arrange
      const user = await userService.createUser('test@example.com', 'user');

      // Act
      for (let i = 0; i < 5; i++) {
        await userService.recordFailedLogin(user.id);
      }

      // Assert
      const updated = await userRepository.findById(user.id);
      expect(updated?.status).toBe('locked');
    });
  });
});
