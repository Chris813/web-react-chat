import { User } from "@api/auth/types";
import React from "react";
import UserBox from "./UserBox";
import { useSocket } from "@context/socket-context";

interface UserListProps {
  items: (User | undefined)[];
}

const UserList: React.FC<UserListProps> = ({ items }: UserListProps) => {
  const { onlineUsers } = useSocket();
  return (
    <aside className='fixed lg:w-80 w-full border-r border-gray-200 block'>
      <div className=' px-5'>
        <div className=' flex-col'>
          <div className=' text-2xl font-bold text-neutral-800 py-4'>
            通讯录
          </div>
        </div>
        {items.map(
          (item, index) =>
            item && (
              <UserBox
                key={index}
                data={item}
                isOnline={onlineUsers.includes(item.id)}
              />
            )
        )}
      </div>
    </aside>
  );
};

export default UserList;
