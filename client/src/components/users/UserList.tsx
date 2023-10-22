import { User } from "@api/auth/types";
import React from "react";
import UserBox from "./UserBox";

interface UserListProps {
  items: (User | undefined)[];
}

const UserList: React.FC<UserListProps> = ({ items }: UserListProps) => {
  return (
    <aside className='fixed lg:w-80 w-full border-r border-gray-200 block'>
      <div className=' px-5'>
        <div className=' flex-col'>
          <div className=' text-2xl font-bold text-neutral-800 py-4'>
            People
          </div>
        </div>
        {items.map(
          (item, index) => item && <UserBox key={index} data={item} />
        )}
      </div>
    </aside>
  );
};

export default UserList;