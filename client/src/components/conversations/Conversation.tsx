import React, { useEffect, useMemo, useState } from "react";
import ConversationList from "./ConversationList";

import { useMount } from "@utils/use";
import { getConversations } from "@api/conversations";
import { ConversationProp } from "@api/conversations/types";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Conversation: React.FC = () => {
  const [conversations, setConversation] = useState<
    ConversationProp[] | null
  >();
  const navigate = useNavigate();

  const location = useLocation();
  const conversationId = useMemo(
    () => location.state?.id,
    [location.state?.id]
  );
  const [isLoading, setIsLoading] = useState(false);
  useMount(async () => {
    getConversations().then((res) => {
      setConversation(res.data.data.conversations);
      setIsLoading(true);
    });
    // console.log(res.data.data.conversations);
    // if (conversationId) {
    //   navigate(`${conversationId}`);
    // }
  });
  useEffect(() => {
    if (conversationId && isLoading) {
      const conversation = conversations?.find(
        (item) => item.id === conversationId
      );
      navigate(`${conversationId}`, { state: { conversation: conversation } });
    }
  }, [conversationId, conversations, isLoading, navigate]);
  return (
    <main className='h-full'>
      {conversations && <ConversationList initialItems={conversations} />}
      <div className='hidden lg:block lg:pl-80 h-full'>
        <Outlet />
      </div>
    </main>
  );
};

export default Conversation;
