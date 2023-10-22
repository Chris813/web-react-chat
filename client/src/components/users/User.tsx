import { User } from "@api/auth/types";
import { getAllUsers } from "@api/user";
import { useAuth } from "@context/auth-context";
import { useArray, useMount } from "@utils/use";
import UserList from "./UserList";
import { EmptyState } from "@components/EmptyState";

const UserPage = () => {
  const { user } = useAuth();
  const { value, setValue } = useArray<User | undefined>([]);
  useMount(() => {
    user && getAllUsers(user?.id).then((res) => setValue(res.data.users));
  });
  return (
    <main className='h-full'>
      <UserList items={value} />
      <div className='hidden lg:block lg:pl-80 h-full'>
        <EmptyState />
      </div>
    </main>
  );
};
export default UserPage;
