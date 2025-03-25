import { UserRequest } from '../../domain';
import { faker } from '@faker-js/faker';

export function aUserRequest(partialUser: Partial<UserRequest> = {}): UserRequest {
  return {
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    name: faker.person.fullName(),
    phoneNumber: faker.phone.number(),
    ...partialUser
  };
}
