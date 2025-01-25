# Iteration 5: Phone Number

## Story

We've been getting feedback from users that they'd like to add their phone number to their profile so that they can receive notifications via SMS. Let's add phone number support to our user service.

### Lessons Learned:

Better to group error messages together in a single place. This makes it easier to maintain and update error messages.

```typescript
export class DuplicateEmailError extends Error {
    // ...
}
export class InvalidEmailError extends Error {
    // ...
}
```