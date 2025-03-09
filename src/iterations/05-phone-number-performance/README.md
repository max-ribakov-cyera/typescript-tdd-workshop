# Iteration 5: Phone Number

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

# Iteration 5: Phone Number - Performance

### Story

Tl;dr 1 million users findByPhoneNumber and findByEmail should be less than 10 milliseconds, preferably 5.

1 million users have signed up for our service, and we're noticing that our user search is starting to slow down. We need to optimize our user search to handle the increased load.
