describe('Jest Matchers', () => {
  const user = { email: 'jane@dev.com', name: 'Jane Developer', age: 30 };
  const userCopy = { email: 'jane@dev.com', name: 'Jane Developer', age: 30 };
  const userWithExtraProp = { email: 'jane@dev.com', name: 'Jane Developer', age: 30, extra: true };

  it('should match object properties with toMatchObject', () => {
    expect(user).toMatchObject({ email: 'jane@dev.com' }); // Test on what you care
  });

  it('should be the same instance with toBe', () => {
    expect(user).toBe(user); // Passes
    expect(user).not.toBe(userCopy); // Fails because they are different instances
  });

  it('should be deeply equal with toEqual', () => {
    expect(user).toEqual(userCopy); // Passes because they have the same properties and values
  });

  it('should be strictly equal with toStrictEqual', () => {
    expect(user).toStrictEqual(userCopy); // Passes because they have the same properties and values
    expect(user).not.toStrictEqual(userWithExtraProp); // Fails because of the extra property
  });
});