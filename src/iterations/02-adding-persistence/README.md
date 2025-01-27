# Iteration 1: Basic User Creation

## Key Takeaways

```typescript
expect(user.email).toBe('jane@dev.com');
expect(user.name).toBe('Jane Developer');
```

Instead of matching each property of an object with it's own assertion, you can use `objectMatching`
to match on some properties of an object in one assertion.

Try to keep a single assertion per test. This makes it easier to understand what's being tested.

```typescript
expect(user).toMatchObject({ email: 'jane@dev.com', name: 'Jane Developer' });
```

# Iteration 2: Adding Persistence

### Story

Great news! DevConnect is getting traction. We need to actually store our users somewhere so we
can retrieve them later. Let's start with the simplest possible storage - an in-memory array.
