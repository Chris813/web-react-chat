import { ConversationProp } from "@api/conversations/types";
import React, { useCallback, useMemo } from "react";
import { format } from "date-fns";
import useOtherUser from "@hooks/useOtherUser";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import Avatar from "@components/Avatar";
import { useAuth } from "@context/auth-context";
import AvatarGroup from "@components/AvatarGroup";
interface ConversationBoxProps {
  // Define any props you need here
  data: ConversationProp;
  selected: boolean;
  isOpen: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
  isOpen,
}) => {
  const { user } = useAuth();
  const otherUser = useOtherUser(data);
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(`${data.id}`, { state: { conversation: data } });
  }, [data, navigate]);
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) return false; //如果没有消息，就没有已读

    const seenArray = lastMessage.seenIds || [];
    if (!user || !user.id) {
      return false;
    }
    if (lastMessage.senderId === user.id) return false; //如果是自己发的消息，默认已读
    if (isOpen) return false; //如果是打开的对话，默认已读
    return seenArray.filter((item) => item === user.id).length === 0;
  }, [lastMessage, user, isOpen]);

  const lastMassageText = useMemo(() => {
    if (lastMessage?.image) {
      return "发送了一张图片";
    }
    if (lastMessage?.body) {
      return lastMessage.body;
    }
    return "开启了一个新的对话";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        ` w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-3`,
        selected ? "bg-neutral-100" : "bg-white"
      )}>
      {data.isGroup ? (
        <AvatarGroup users={data.users} hasSeen={hasSeen} />
      ) : (
        <Avatar user={otherUser} kind='conversation' hasSeen={hasSeen} />
      )}

      <div className='flex-1 min-w-0'>
        <div className='focus:outline-none'>
          <div className='flex justify-between items-center mb-1'>
            <p className=' text-base font-medium text-gray-900 truncate'>
              {!data.isGroup && otherUser?.name}
              {data.isGroup && data.name}
            </p>
            {data.lastMessageAt && (
              <p className='text-xs text-gray-500 font-light'>
                {format(new Date(data.lastMessageAt), "p")}
              </p>
            )}
          </div>
          <p className={clsx(`text-sm truncate text-gray-500`)}>
            {lastMassageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
