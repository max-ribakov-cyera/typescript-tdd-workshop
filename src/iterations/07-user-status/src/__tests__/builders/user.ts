import { User } from '../../domain';
import { faker } from '@faker-js/faker';

export function aUser(partialUser: Partial<User> = {}): User {
  return {
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    name: faker.person.fullName(),
    phoneNumber: faker.phone.number(),
    ...partialUser
  };
}
