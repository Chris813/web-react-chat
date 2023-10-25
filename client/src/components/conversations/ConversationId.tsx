import { getConversationById, getMessages } from "@api/conversations";
import { ConversationProp } from "@api/conversations/types";
import Header from "@components/conversationId/Header";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ConversationId = () => {
  const { id } = useParams();
  const [conversation, setConversation] = useState<ConversationProp | null>(
    null
  );
  const [massages, setMassages] = useState<ConversationProp["messages"]>([]); //聊天记录
  useEffect(() => {
    async function getConvAndMsg(id: string) {
      const convRes = await getConversationById(id as string);
      setConversation(convRes.data.data.conversation);
      const msgRes = await getMessages(id as string);
      setMassages(msgRes.data.data.messages);
    }
    getConvAndMsg(id as string);
  }, [id]);
  return (
    <div className='h-full'>
      <div className=' h-full flex flex-col'>
        <Header conversation={conversation}></Header>
      </div>
    </div>
  );
};

export default ConversationId;
