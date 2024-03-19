import React, { useEffect, useMemo, useState } from "react";
import ConversationList from "./ConversationList";

import { useMount } from "@utils/use";
import { getConversations } from "@api/conversations";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getAllUsers } from "@api/user";
import { useAuth } from "@context/auth-context";
import { useSocket } from "@context/socket-context";
import { User } from "@api/auth/types";
import { useConv } from "@context/conversation-context";

const Conversation: React.FC = () => {
  // const [conversations, setConversation] = useState<
  //   ConversationProp[] | null
  // >();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const conversationId = useMemo(
    () => location.state?.id,
    [location.state?.id]
  );
  const { arrivedMsg } = useSocket();
  const [users, setUsers] = useState([]);
  const { isLoading, setIsLoading, conversations, setConversation } = useConv();
  useMount(async () => {
    user && getAllUsers(user?.id).then((res) => setUsers(res.data.users));
  });
  useEffect(() => {
    if (arrivedMsg && conversations) {
      let conversation = conversations.find(
        (item) => item.id === arrivedMsg.conversationId
      );
      if (!conversation) {
        setIsLoading(false);
        getConversations().then((res) => {
          setConversation(res.data.data.conversations);
          setIsLoading(true);
        });
        conversation = conversations.find(
          (item) => item.id === arrivedMsg.conversationId
        );
      }
      let sender;
      if (conversation) {
        sender = conversation?.users.find(
          (item) => item.id === arrivedMsg.senderId
        );
      }
      arrivedMsg.conversation = conversation;
      arrivedMsg.sender = sender as User;
      setConversation((prev) => {
        const index = prev?.findIndex(
          (item) => item.id === arrivedMsg.conversationId
        );
        if (index !== undefined && index !== -1 && prev) {
          const updatedMessages = [...prev[index].messages, arrivedMsg];
          return prev.map((item, idx) =>
            idx === index ? { ...item, messages: updatedMessages } : item
          );
        }
        return prev;
      });
    }
  }, [arrivedMsg, setConversation, setIsLoading]);

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
      {conversations && (
        <ConversationList initialItems={conversations} users={users} />
      )}
      <div className='lg:block lg:pl-80 h-full sm:block'>
        <Outlet />
      </div>
    </main>
  );
};

export default Conversation;
