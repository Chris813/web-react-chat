import { getConversationById, getMessages } from "@api/conversations";
import { ConversationProp } from "@api/conversations/types";
import Body from "@components/conversationId/Body";
import Form from "@components/conversationId/Form";
import Header from "@components/conversationId/Header";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const ConversationId = () => {
  const { id } = useParams();
  const coversationId = useMemo(() => id, [id]);
  const [conversation, setConversation] = useState<ConversationProp | null>(
    null
  );
  const [massages, setMassages] = useState<ConversationProp["messages"]>([]); //聊天记录
  async function getConvAndMsg(id: string) {
    const convRes = await getConversationById(id as string);
    setConversation(convRes.data.data.conversation);
    const msgRes = await getMessages(id as string);
    setMassages(msgRes.data.data.messages);
  }
  useEffect(() => {
    getConvAndMsg(coversationId as string);
  }, [coversationId]);
  return (
    <div className='h-full'>
      <div className=' h-full flex flex-col'>
        <Header conversation={conversation} />
        <Body />
        <Form conversationId={coversationId} />
      </div>
    </div>
  );
};

export default ConversationId;
