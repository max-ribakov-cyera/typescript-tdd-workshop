import { User } from '../core/types';
import { UserRepository } from './user.interface';

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.id, { ...user });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.email === email);
    return user ? { ...user } : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }

  async update(id: string, updates: Partial<User>): Promise<void> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    
    this.users.set(id, { ...user, ...updates, updatedAt: new Date() });
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}
