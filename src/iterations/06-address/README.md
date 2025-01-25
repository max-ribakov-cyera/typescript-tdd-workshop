# Iteration 6: Address

## Story

Customers are asking for the ability to add their address to their profile so that they can receive packages. Let's add address support to our user service.

### Lessons Learned:

To prevent passing a lot of parameters to a function, you can pass an object instead. This makes the function more readable and maintainable.

```typescript
createUser(email: string, name: string, phoneNumber: string): User {
  // 3rd parameter is a good time to start passing an object instead
}
```

With an object:

```typescript
createUser(user: User): User {
    // code
}
```
