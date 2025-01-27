import { UserCreationParams } from '../../domain';

export function aUserCreationParams(
  partialUser: Partial<UserCreationParams> = {}
): UserCreationParams {
  return {
    email: 'someEmail@domain.com',
    address: 'someAddress',
    name: 'someName',
    phoneNumber: '555-5555-555',
    ...partialUser
  };
}
