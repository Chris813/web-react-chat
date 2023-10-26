import { MessageProp } from "@api/conversations/types";
import Avatar from "@components/Avatar";
import { useAuth } from "@context/auth-context";
import clsx from "clsx";
import { format } from "date-fns";
import React from "react";

//the props are isLast={i===initialMessages.length-1} key={message.id} message={message}

interface MessageBoxProps {
  isLast: boolean;
  message: MessageProp;
}

const MessageBox: React.FC<MessageBoxProps> = ({ isLast, message }) => {
  const { user } = useAuth();
  const isOwn = user?.id === message.senderId;
  const seenList = (message.seen || [])
    .filter((seener) => seener.id !== message.sender.id)
    .map((seener) => seener.name)
    .join(", ");

  const container = clsx(` flex gap-3 p-4`, isOwn && "justify-end");
  const avatar = clsx(isOwn && " order-2");
  const body = clsx(" flex flex-col gap-1", isOwn && "items-end");
  const content = clsx(
    " text-sm w-fit overflow-hodden",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    message.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );
  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={message.sender} kind='conversation' />
      </div>
      <div className={body}>
        <div className=' flex items-center gap-1'>
          <div className=' text-sm text-gray-500'>{message.sender.name}</div>
          <div className=' text-xs text-gray-400'>
            {format(new Date(message.createdAt), "p")}
          </div>
        </div>
        <div className={content}>
          {message.image ? (
            <img
              src={message.image}
              alt='message image'
              height='288'
              width='288'
              className=' rounded-md max-w-[300px] max-h-[300px]'
            />
          ) : (
            <div>{message.body}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
