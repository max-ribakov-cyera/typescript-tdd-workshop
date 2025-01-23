import { User } from '../core/types';

export interface UserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, updates: Partial<User>): Promise<void>;
  delete(id: string): Promise<void>;
}
