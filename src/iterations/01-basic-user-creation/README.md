# Iteration 1: Basic User Creation

## Story

Our startup, "DevConnect", is launching a new developer community platform. 
The first step? Let users sign up! We need the most basic version of user creation - 
just email and name for now. Keep it simple!

```
type User {
  email: string;
  name: string;
}

class UserService {
  createUser(email: string, name: string): User {
    // code
  }
}
```