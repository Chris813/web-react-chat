// import { User } from "@api/auth/types";
import { User } from "@api/auth/types";
import { getMessages, seenMessages } from "@api/conversations";
import { ConversationProp, MessageProp } from "@api/conversations/types";
import Body from "@components/conversationId/Body";
import Form from "@components/conversationId/Form";
import Header from "@components/conversationId/Header";
import LoadingModal from "@components/modal/LoadingModal";
import { useAuth } from "@context/auth-context";
import { useConv } from "@context/conversation-context";
import { useSocket } from "@context/socket-context";
import useConversation from "@hooks/useConversation";
// import { useSocketEvents } from "@hooks/useSocketEvents";

import { useEffect, useMemo, useState } from "react";

const ConversationId = () => {
  const { conversationId } = useConversation();
  const { conversations, setConversation } = useConv();
  const conversation = useMemo(
    () =>
      conversations?.find(
        (item) => item.id === conversationId
      ) as ConversationProp,
    [conversations, conversationId]
  );
  const { user } = useAuth();

  const { arrivedMsg } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ConversationProp["messages"]>([]); //聊天记录
  const [sendMsg, setSendMsg] = useState<MessageProp | null>(null); //发送的消息
  const { socket, onlineUsers } = useSocket();
  const isOnline = useMemo(
    () =>
      onlineUsers?.includes(
        conversation?.users.find((item) => item.id !== user?.id)?.id as string
      ),
    [onlineUsers, conversation, user]
  );
  async function getMsg(id: string) {
    setIsLoading(true);
    const msgRes = await getMessages(id as string);
    setMessages(msgRes.data.data.messages);
    setIsLoading(false);
  }

  const unSeenMsg = useMemo(
    () =>
      messages.filter((msg) => {
        return !msg?.seenIds?.includes(user?.id as string);
      }),
    [messages, user]
  );

  useEffect(() => {
    if (unSeenMsg.length > 0) {
      seenMessages((conversation as ConversationProp).id);
      socket.emit("seen-message", {
        convId: (conversation as ConversationProp).id,
        seenBy: user?.id,
        to: conversation?.users
          .filter((item) => item.id !== user?.id)
          .map((item) => item.id),
      });
      setConversation((prev) => {
        const index = prev?.findIndex(
          (item) => item.id === (conversation as ConversationProp).id
        );
        if (index !== undefined && index !== -1 && prev) {
          const updatedMessages = prev[index].messages.map((item) => {
            if (item.seenIds.includes(user?.id as string)) {
              return item;
            }
            return {
              ...item,
              seenIds: [...item.seenIds, user?.id as string],
            };
          });
          return prev.map((item, idx) =>
            idx === index ? { ...item, messages: updatedMessages } : item
          );
        }
        return prev;
      });
    }
  }, [unSeenMsg]);

  //接收的消息
  useEffect(() => {
    if (arrivedMsg) {
      if (arrivedMsg.conversationId !== conversationId) return;
      const sender = conversation.users.find(
        (item) => item.id === arrivedMsg.senderId
      ) as User;
      arrivedMsg.sender = sender;
      setMessages((prev) => [...prev, arrivedMsg]);
    }
  }, [arrivedMsg]);
  useEffect(() => {
    setMessages([]);
    getMsg(conversationId as string);
  }, [conversationId]);

  //自己发送的消息需要显示在聊天界面以及左侧聊天栏
  useEffect(() => {
    if (sendMsg) {
      setMessages((prev) => [...prev, sendMsg]);
      setConversation((prev) => {
        const index = prev?.findIndex((item) => item.id === conversation.id);
        if (index !== undefined && index !== -1 && prev) {
          const updatedMessages = [
            ...prev[index].messages,
            sendMsg as MessageProp,
          ];
          return prev.map((item, idx) =>
            idx === index ? { ...item, messages: updatedMessages } : item
          );
        }
        return prev;
      });
    }
  }, [sendMsg]);
  return (
    <>
      {isLoading && <LoadingModal />}
      <div className='h-full'>
        <div className=' h-full flex flex-col'>
          {conversation && (
            <Header conversation={conversation} isOnline={isOnline} />
          )}
          <Body initialMessages={messages} />
          {conversation && (
            <Form conversation={conversation} updateMessages={setSendMsg} />
          )}
        </div>
      </div>
    </>
  );
};

export default ConversationId;
