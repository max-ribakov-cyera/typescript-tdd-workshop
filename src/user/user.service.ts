import { User } from '../core/types';
import { ValidationError, UserExistsError } from '../core/errors';
import { UserRepository } from './user.interface';

export class UserService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;

  constructor(private userRepository: UserRepository) {}

  async createUser(email: string, role: 'admin' | 'user'): Promise<User> {
    if (!this.isValidEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new UserExistsError(email);
    }

    const user: User = {
      id: this.generateId(),
      email,
      role,
      status: 'active',
      loginAttempts: 0,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.userRepository.save(user);
    return user;
  }

  async recordFailedLogin(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const loginAttempts = user.loginAttempts + 1;
    const updates: Partial<User> = {
      loginAttempts,
      updatedAt: new Date()
    };

    if (loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      updates.status = 'locked';
    }

    await this.userRepository.update(userId, updates);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
