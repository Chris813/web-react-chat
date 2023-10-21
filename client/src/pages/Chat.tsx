import { User } from "@api/auth/types";
import { getAllUsers } from "@api/user";
import { useAuth } from "@context/auth-context";
import { useArray, useMount } from "@utils/use";
import UsersLayout from "./users/UsersLayout";
import { Outlet } from "react-router-dom";
function Chat() {
  const { user } = useAuth();
  const { setValue } = useArray<User | undefined>([]);
  useMount(() => {
    user && getAllUsers(user?.id).then((res) => setValue(res.data.users));
  });
  return (
    <UsersLayout>
      <div className='hidden lg:block lg:pl-80 h-full'>
        <Outlet />
      </div>
    </UsersLayout>
  );
}

export default Chat;
