import { useMemo } from "react";
import { useParams } from "react-router-dom";

const useConversation = () => {
  const params = useParams();
  const conversationId = useMemo(() => {
    if (!params?.conversationId) return "";
    return params.conversationId as string;
  }, [params?.conversationId]);
  const isOpen = useMemo(() => !!conversationId, [conversationId]);
  return useMemo(
    () => ({
      isOpen,
      conversationId,
    }),
    [isOpen, conversationId]
  );
};
export default useConversation;
