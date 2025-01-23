import { User } from '../../core/types';

export class UserBuilder {
  private user: User = {
    id: '1',
    email: 'test@example.com',
    role: 'user',
    status: 'active',
    loginAttempts: 0,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  withId(id: string): UserBuilder {
    this.user.id = id;
    return this;
  }

  withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  withRole(role: 'admin' | 'user'): UserBuilder {
    this.user.role = role;
    return this;
  }

  withStatus(status: 'active' | 'inactive' | 'locked'): UserBuilder {
    this.user.status = status;
    return this;
  }

  build(): User {
    return { ...this.user };
  }
}
