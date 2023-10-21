export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  token: string;
}
export interface resProps {
  msg?: string;
  status: string;
  token?: string;
  user: User;
  image?: string;
}
