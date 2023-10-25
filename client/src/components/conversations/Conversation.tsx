import React from "react";
import ConversationList from "./ConversationList";

import { useArray, useMount } from "@utils/use";
import { getConversations } from "@api/conversations";
import { ConversationProp } from "@api/conversations/types";
import { Outlet } from "react-router-dom";

const Conversation: React.FC = () => {
  const { value, setValue } = useArray<ConversationProp>([]);
  useMount(async () => {
    const res = await getConversations();
    setValue(res.data.data.conversations);
  });

  return (
    <main className='h-full'>
      <ConversationList initialItems={value} />
      <div className='hidden lg:block lg:pl-80 h-full'>
        <Outlet />
      </div>
    </main>
  );
};

export default Conversation;
