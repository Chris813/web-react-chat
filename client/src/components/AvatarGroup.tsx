import { User } from "@api/auth/types";
import React from "react";
import noImage from "../assets/images/noimage.jpg";
interface AvatarGroupProps {
  users: User[];
  hasSeen: boolean;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users }) => {
  const sliceUsers = users.slice(0, 3);
  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };
  return (
    <div className=' relative h-11 w-11'>
      {sliceUsers.map((user, index) => (
        <div
          key={user.id}
          className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px] ${
            positionMap[index as keyof typeof positionMap]
          }`}>
          <img
            src={
              user.image ? `data:image/svg+xml;base64,${user.image}` : noImage
            }
            alt={user.name}
            className='h-full w-full object-cover'
          />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
