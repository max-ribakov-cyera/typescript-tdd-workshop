# Iteration 7: User status

## Key Takeaways:

Usually create request of an entity will not have all of the fields.
It's better to create a partial entity and then merge it with the default values.

```typescript
createUser(userCreationParams: UserCreationParams): User {
    const user = { ...userCreationParams, status: UserStatus.PENDING };
    // ...
    return user;
}
```

It's hard to delete items from an array, map or set are better options.

```typescript

```

# Iteration 8: Logging

### Story

We've been getting reports from our support team that users are experiencing issues with their accounts. We need to add logging to our user service so we can better understand what's going on.
