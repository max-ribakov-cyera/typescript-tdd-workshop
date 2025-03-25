# Iteration 6: Address

## Key Takeaways:

#### Beautiful Object Builders in TypeScript

moving to a single test setup might cause dependencies between tests.
This can be solved by adding a clean up function that runs after\before each test
or using test data that won't be affected by other tests - a lib like faker is helpful in such cases.

```typescript
// BAD
export function aUser(partialUser: Partial<User> = {}): User {
  return {
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    name: faker.person.fullName(),
    phoneNumber: faker.phone.number(),
    ...partialUser
  };
}
```

# Iteration 7: User status

#### Story

We've been getting reports from our support team that users are experiencing issues with their accounts. We need to add logging to our user service so we can better understand what's going on.
