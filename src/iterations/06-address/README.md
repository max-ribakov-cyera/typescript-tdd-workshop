# Iteration 5: Phone Number - Performance

## Key Takeaways:

### **performance.now() vs Date.now()**

performance.now() returns a floating-point number representing the time in milliseconds
since the start of the function that returns it. It is more precise than Date.now() which returns the time in milliseconds since the Unix epoch.

```typescript
const start = performance.now();
// code
const end = performance.now();
console.log(`Execution time: ${end - start} milliseconds`);
```

### faker.js

a library that generates fake data like names, emails, and phone numbers. It's useful for generating test data.

```typescript
import { faker } from '@faker-js/faker';

const email = faker.internet.email();
const phoneNumber = faker.phone.phoneNumber();
```

### Promise.all()

a built-in JavaScript function that takes an array of promises and returns a single promise that resolves when all of the promises in the array have resolved.

```typescript
const promises = [promise1, promise2, promise3];
Promise.all(promises).then((results) => {
  console.log(results);
});
```

The downside of Promise.all() is that if one of the promises in the array rejects, the entire Promise.all() call will reject. This can be problematic if you want to handle errors individually.

### Array.from

Array.from() lets you create Arrays from:

- iterable objects (objects such as Map and Set); or, if the object is not iterable,
- **array-like objects (objects with a length property and indexed elements).**

```typescript
const randomUsersToSearch = Array.from({ length: numOfUsersToSearch }, () => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  phoneNumber: faker.phone.number()
}));
```

# Iteration 6: Address

### Story

Customers are asking for the ability to add their address to their profile so that they can receive packages. Let's add address support to our user service.

REQUIRED! BUT NOT UNIQUE
