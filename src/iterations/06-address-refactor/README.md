# Iteration 6: Address

## Key Takeaways:

#### Beautiful Object Builders in TypeScript

**Fixtures** - hard coded values, residing either in external files, or in the test file itself - are a bad approach; they inadvertently couple tests to each other, and when trying to solve this problem, we end up with too many fixtures.

```typescript
// BAD
const user: User = {
    name: 'John Doe',
    // ...
};

// GOOD (but can be improved - see next iteration)
export function aUser(partialUser: Partial<User> = {}): User {
  return {
    email: 'someEmail@domain.com',
    // ...
    ...partialUser,]
    };
});
```

# Iteration 6: Address - Refactor

### Story

It's time to refactor our user service and extract a repository class to handle user data storage. This will help us keep our code clean and organized as we add more features to our user service.

Plus we instantiate the user service for each class, which is not ideal. We should instantiate it once.
