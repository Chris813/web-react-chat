import { MessageProp } from "@api/conversations/types";
import React, { useEffect, useRef } from "react";
import MessageBox from "./MessageBox";

interface BodyProps {
  initialMessages: MessageProp[];
}
const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current!.scrollIntoView({ behavior: "smooth" });
  }, [initialMessages]);

  return (
    <div className=' flex-1 overflow-y-auto w-full'>
      {initialMessages.map((message, i) => (
        <MessageBox
          isLast={i === initialMessages.length - 1}
          key={i}
          message={message}
        />
      ))}
      <div ref={bottomRef} className=' pt-24' />
    </div>
  );
};

export default Body;
