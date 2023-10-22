import React from "react";
import { User } from "@api/auth/types";
import { getAllUsers } from "@api/user";
import { useAuth } from "@context/auth-context";
import { useArray, useMount } from "@utils/use";
import UserList from "./UserList";
interface UsersLayoutProps {
  children: React.ReactNode;
}
const UsersLayout = ({ children }: UsersLayoutProps) => {
  const { user } = useAuth();
  const { value, setValue } = useArray<User | undefined>([]);
  useMount(() => {
    user && getAllUsers(user?.id).then((res) => setValue(res.data.users));
  });
  return (
    <main className='h-full'>
      <UserList items={value} />
      {children}
    </main>
  );
};

export default UsersLayout;
