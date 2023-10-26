import { MessageProp } from "@api/conversations/types";
import React, { useRef } from "react";
import MessageBox from "./MessageBox";
import useConversation from "@hooks/useConversation";
import { seenMessages } from "@api/conversations";
import { useMount } from "@utils/use";

interface BodyProps {
  initialMessages: MessageProp[];
}
const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();
  console.log(conversationId);

  return (
    <div className=' flex-1 overflow-y-auto'>
      {initialMessages.map((message, i) => (
        <MessageBox
          isLast={i === initialMessages.length - 1}
          key={message.id}
          message={message}
        />
      ))}
      <div ref={bottomRef} className=' pt-24' />
    </div>
  );
};

export default Body;
