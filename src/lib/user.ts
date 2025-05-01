type User = {
    email: string;
    password: string;
  };
  
  const users: User[] = [
    {
      email: "test@example.com",
      password: "password123",
    },
  ];
  
  export function findUserByEmail(email: string): User | undefined {
    return users.find((user) => user.email === email);
  }
  
  export function validateUser(email: string, password: string): boolean {
    const user = findUserByEmail(email);
    return user?.password === password;
  }