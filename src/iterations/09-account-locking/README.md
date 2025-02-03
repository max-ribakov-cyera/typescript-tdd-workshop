# Iteration 8: Logging

## Key Takeaways:

use jest-mock-extended to quickly mock a dependency in a test.

```typescript
const logger = mock<Logger>();
const userService = new UserService(new InMemoryUsersRepository(), logger);

// ...

expect(logger.info).toHaveBeenCalledWith('User created', user);
```

It's a nice touch to leave documentation in the code in form of learning tests.
Learning tests are tests that are written to learn how a certain piece of code works.
Not to test it, but to learn from it.

# Iteration 9: Account Locking

### Story

As part of enhancing the security of our user authentication system, we need to implement a feature that allows users to set passwords for their accounts and introduces account locking mechanisms to prevent unauthorized access after multiple failed login attempts.

### Requirements

#### Password Management:

- Users should be able to set a password during account creation.
- Passwords should be securely hashed before storing them. Use bcrypt to hash passwords.
- Users should be able to log in using their email and password.

#### Account Locking:

- If a user enters an incorrect password three times consecutively, their account should be locked for 5 minutes.
- During the lock period, any login attempts should return a message indicating that the account is locked.
- After the lock period, the user should be able to attempt to log in again.
