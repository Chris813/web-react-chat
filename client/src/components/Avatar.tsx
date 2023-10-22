import { User } from "@api/auth/types";
import React from "react";
import noImage from "../assets/images/noimage.jpg";
interface AvatarProps {
  user: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }: { user: User }) => {
  return (
    <div className=' relative'>
      <div className='flex-shrink-0'>
        <img
          className='h-10 w-10 rounded-full'
          src={user.image ? `data:image/svg+xml;base64,${user.image}` : noImage}
        />
      </div>
      <span className=' absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3'></span>
    </div>
  );
};

export default Avatar;
