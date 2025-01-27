# Iteration 8: Logging

## Key Takeaways:

moving to a single test setup might cause dependencies between tests. This can be solved by adding a clean up function that runs after\before each test or using test data that won't be affected by other tests - a lib like faker is helpful in such cases.

```typescript
export function aUserCreationParams(
  partialUser: Partial<UserCreationParams> = {}
): UserCreationParams {
  return {
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    name: faker.person.fullName(),
    phoneNumber: faker.phone.number(),
    ...partialUser
  };
}
});
```

# Iteration 9: Account Locking

### Story

As part of enhancing the security of our user authentication system, we need to implement a feature that allows users to set passwords for their accounts and introduces account locking mechanisms to prevent unauthorized access after multiple failed login attempts.

### Requirements

#### Password Management:

- Users should be able to set a password during account creation.
- Passwords should be securely hashed before storing them.
- Users should be able to log in using their email and password.

#### Account Locking:

- If a user enters an incorrect password three times consecutively, their account should be locked for 5 minutes.
- During the lock period, any login attempts should return a message indicating that the account is locked.
- After the lock period, the user should be able to attempt to log in again.
