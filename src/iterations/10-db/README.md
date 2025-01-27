# Iteration 9: Account Locking Green

## Key Takeaways:

- You should refactor your code to separate the concerns of your service => [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle).
  - move the user lookup, creation and update logic to a repository class.

```typescript
// Setup
const userService = new UserService(new InMemoryUserServiceRepository(), ...);
```

- If you want to control your environment without changing your api you can use the test set up and tear down functions to control the environment.

```typescript
// Setup
const timeServer = mock<TimeServer>();
const userService = new UserService(new InMemoryUserServiceRepository(), timeServer, logger);

// Set mock behaviour before usage
timeServer.getCurrentTime.mockReturnValue(new Date(Date.now() + 1000 * 60 * 6));
```

# Iteration 10: DB

### Story

DevConnect is growing! Time to switch from in-memory storage to a real database.
Thanks to our thorough test suite, we can be confident in our new implementation.
