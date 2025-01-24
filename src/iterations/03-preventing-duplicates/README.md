# Iteration 3: Preventing Duplicates

## Story
Uh-oh! We've discovered users can register multiple times with the same email.
Our community managers are seeing duplicate accounts causing confusion. We need to prevent this from happening.

### Lessons Learned:
find returns the first element in the array that satisfies the provided testing function. Otherwise, it returns undefined.

```typescript
findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }
```