import React from "react";
import UsersLayout from "./UsersLayout";
import { EmptyState } from "@components/EmptyState";

const User = () => {
  return (
    <UsersLayout>
      <div className='hidden lg:block lg:pl-80 h-full'>
        <EmptyState />
      </div>
    </UsersLayout>
  );
};

export default User;
