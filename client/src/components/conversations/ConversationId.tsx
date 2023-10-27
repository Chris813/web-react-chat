import { getMessages, seenMessages } from "@api/conversations";
import { ConversationProp } from "@api/conversations/types";
import Body from "@components/conversationId/Body";
import Form from "@components/conversationId/Form";
import Header from "@components/conversationId/Header";

import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const ConversationId = () => {
  const location = useLocation();
  const conversation = useMemo(
    () => location.state?.conversation,
    [location.state?.conversation]
  );
  const [massages, setMassages] = useState<ConversationProp["messages"]>([]); //聊天记录
  const initialmessages = useMemo(() => massages, [massages]);
  async function getAndSeenMsg(id: string) {
    // const convRes = await getConversationById(id as string);
    // setConversation(convRes.data.data.conversation);
    const msgRes = await getMessages(id as string);
    setMassages(msgRes.data.data.messages);
    await seenMessages(conversation.id);
  }
  useEffect(() => {
    getAndSeenMsg((conversation as ConversationProp).id);
  }, [conversation]);
  return (
    <div className='h-full'>
      <div className=' h-full flex flex-col'>
        <Header conversation={conversation} />
        <Body initialMessages={initialmessages} />
        <Form conversationId={conversation?.id} />
      </div>
    </div>
  );
};

export default ConversationId;
