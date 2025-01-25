# Iteration 7: User status

## Story

We've been getting reports from our support team that users are experiencing issues with their accounts. We need to add logging to our user service so we can better understand what's going on.

### Lessons Learned:

#### Beautiful Object Builders in TypeScript

Fixtures - hard coded values, residing either in external files, or in the test file itself - are a bad approach; they inadvertently couple tests to each other, and when trying to solve this problem, we end up with too many fixtures.


```typescript
// BAD
const user: User = {
    name: 'John Doe',
    // ...
};

// GOOD (but can be improved)
export function aUser(partialUser: Partial<User> = {}): User {
  return {
    email: 'someEmail@domain.com',
    // ...
    ...partialUser,]
    };
});
```