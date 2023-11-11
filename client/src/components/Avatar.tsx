import { User } from "@api/auth/types";
import React from "react";
import noImage from "../assets/images/noimage.jpg";
import clsx from "clsx";
interface AvatarProps {
  user: User;
  kind?: "conversation" | "user";
  hasSeen?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ user, kind = "user", hasSeen }) => {
  return (
    <div className=' relative'>
      <div className='flex-shrink-0'>
        <img
          className='h-10 w-10 rounded-full'
          src={user.image ? `data:image/svg+xml;base64,${user.image}` : noImage}
        />
      </div>
      <span
        className={clsx(
          `absolute block rounded-full ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3`,
          kind === "conversation"
            ? hasSeen
              ? " bg-red-700 ring-0"
              : " hidden"
            : "bg-green-500"
        )}
      />
    </div>
  );
};

export default Avatar;
