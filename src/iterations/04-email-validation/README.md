# Iteration 3: Preventing Duplicates

## Key Takeaways:

use `() => { /* ACT code */ }` in `expect()` to assert on thrown errors for non async functions

```typescript
expect(() => userService.createUser(email, 'Different Name')).toThrow(DuplicateEmailError);
```

#### Defining a Custom Error in TypeScript

To define a custom error in TypeScript, you need to extend the built-in Error class. However, there are some nuances you need to be aware of, particularly around setting up the prototype chain correctly.

Here’s how to define a custom error:

```typescript
class DuplicateEmailError extends Error {
  constructor(message: string) {
    // Call the constructor of the base class `Error`
    super(message);

    // Set the error name to your custom error class name
    this.name = 'DuplicateEmailError';

    // Set the prototype explicitly to maintain the correct prototype chain
    Object.setPrototypeOf(this, DuplicateEmailError.prototype);
  }
}
```

##### Key Points to Note:

- **Super Call**: The super(message) call invokes the constructor of the Error class, ensuring that the error message is correctly passed and accessible via err.message.

- **Error Name**: Setting this.name to the name of your custom error class makes the error type clear when inspecting stack traces or logs.

- **Prototype Chain**: The most critical step is setting the prototype chain correctly using Object.setPrototypeOf(this, CustomError.prototype). This ensures that instanceof checks work as expected, which is particularly important when TypeScript is transpiled to ES5.

# Iteration 4: Email Validation

### Story

Support tickets are coming in - users are entering invalid email addresses and getting confused when features don't work. We need proper email validation!

\*Add a naive email validation check.
