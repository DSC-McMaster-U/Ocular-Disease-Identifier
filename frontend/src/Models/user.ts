export interface User {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Profile {
  user: User;
  profilePic?: string;
  username?: string;
}
