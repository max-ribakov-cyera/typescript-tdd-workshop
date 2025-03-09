# Iteration 2: Adding Persistence

## Key Takeaways:

find returns the first element in the array that satisfies the provided testing function.
Otherwise, it returns undefined.


```typescript
findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

```

toMatchObject: Checks if an object matches a subset of the properties of another object.
toBe: Checks if two references point to the same object instance.
toEqual: Checks if two objects have the same properties and values.
toStrictEqual: Checks if two objects have the same properties and values, and also ensures that objects do not have extra properties.
 
let's checkout toBeOrNotToBe.spec.ts

# Iteration 3: Preventing Duplicates

### Story

Uh-oh! We've discovered users can register multiple times with the same email.
Our community managers are seeing duplicate accounts causing confusion. We need to prevent this from happening.
