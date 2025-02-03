# Iteration 9: Account Locking

## Key Takeaways:

You can use jest.advanceTimersByTime to advance the time in jest tests

```typescript
jest.useFakeTimers();
// ...
jest.advanceTimersByTime(1000 * 60 * 6);
```
