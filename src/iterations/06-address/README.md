# Iteration 5: Phone Number - Performance

## Key Takeaways:

To prevent passing a lot of parameters to a function, you can pass an object instead. This makes the function more readable and maintainable.

```typescript
createUser(email: string, name: string, phoneNumber: string): User {
  // 3rd parameter is a good time to start passing an object instead
}
```

For easier refactoring you can use destructuring in the function declaration and not have to change the implementation of the function.
You can also destruct the object in the function code.

```typescript
createUser({email, name, phoneNumber}: User): User {
    // code alternative to the above
    // const { email, name, phoneNumber } = user;
}
```

# Iteration 6: Address

### Story

Customers are asking for the ability to add their address to their profile so that they can receive packages. Let's add address support to our user service.

REQUIRED! BUT NOT UNIQUE
