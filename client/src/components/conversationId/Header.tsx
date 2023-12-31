import { ConversationProp } from "@api/conversations/types";
import useOtherUser from "@hooks/useOtherUser";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import Avatar from "@components/Avatar";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@components/AvatarGroup";
interface HeaderProps {
  conversation: ConversationProp | null;
  isOnline?: boolean;
}
const Header: React.FC<HeaderProps> = ({ conversation, isOnline }) => {
  const otherUser = useOtherUser(conversation as ConversationProp);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const statusText = useMemo(() => {
    if (conversation?.isGroup) {
      return `${conversation?.users?.length}人`;
    } else {
      return isOnline ? "在线" : "离线";
    }
  }, [conversation, isOnline]);
  return (
    <>
      <ProfileDrawer
        data={conversation as ConversationProp}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={otherUser}
      />
      <div className=' bg-white w-full flex border-b-[1px] py-3 px-4 lg:px-6 justify-between items-center shadow-sm'>
        <div className=' flex gap-3 items-center'>
          <Link
            to='/coversations'
            className='lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer'>
            <HiChevronLeft size={32} />
          </Link>
          {conversation && conversation.isGroup ? (
            <AvatarGroup users={conversation.users} hasSeen={false} />
          ) : (
            <Avatar user={otherUser} isOnline={isOnline} />
          )}
          <div className=' flex flex-col'>
            <div>{conversation?.name || otherUser.name}</div>
            <div className=' text-xs font-light text-neutral-500'>
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => {
            setDrawerOpen(true);
          }}
          className='cursor-pointer text-sky-500 hover:text-sky-600 transition'
        />
      </div>
    </>
  );
};

export default Header;
