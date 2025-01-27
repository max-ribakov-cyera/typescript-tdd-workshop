import { User } from '../../domain';

export function aUser(partialUser: Partial<User> = {}): User {
  return {
    email: 'someEmail@domain.com',
    address: 'someAddress',
    name: 'someName',
    phoneNumber: '555-5555-555',
    ...partialUser
  };
}
