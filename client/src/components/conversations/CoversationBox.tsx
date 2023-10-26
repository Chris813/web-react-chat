import { ConversationProp } from "@api/conversations/types";
import React, { useCallback, useMemo } from "react";
import { format } from "date-fns";
import useOtherUser from "@hooks/useOtherUser";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import Avatar from "@components/Avatar";
import { useAuth } from "@context/auth-context";
interface ConversationBoxProps {
  // Define any props you need here
  data: ConversationProp;
  selected: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const { user } = useAuth();
  const otherUser = useOtherUser(data);
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(`${data.id}`, { state: { conversation: data } });
  }, [data.id, navigate]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) return false; //如果没有消息，就没有已读

    const seenArray = lastMessage.seen || [];
    if (!user || !user.id) {
      return false;
    }
    return seenArray.filter((item) => item.id === user.id).length === 0;
  }, [lastMessage, user]);

  const lastMassageText = useMemo(() => {
    console.log(lastMessage);
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
      <Avatar user={otherUser} kind='conversation' hasSeen={hasSeen}></Avatar>
      <div className='flex-1 min-w-0'>
        <div className='focus:outline-none'>
          <div className='flex justify-between items-center mb-1'>
            <p className=' text-base font-medium text-gray-900 truncate'>
              {otherUser.name}
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
