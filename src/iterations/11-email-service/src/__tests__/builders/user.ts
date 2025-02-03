import { UserCreationParams } from '../../domain';
import { faker } from '@faker-js/faker';

export function aUserCreationParams(
  partialUser: Partial<UserCreationParams> = {}
): UserCreationParams {
  return {
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
    phoneNumber: faker.phone.number(),
    ...partialUser
  };
}
