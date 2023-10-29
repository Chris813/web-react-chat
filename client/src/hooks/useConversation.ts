import { useMemo } from "react";
import { useParams } from "react-router-dom";

const useConversation = () => {
  const params = useParams();
  const conversationId = useMemo(() => {
    if (!params?.id) return "";
    return params.id as string;
  }, [params?.id]);
  const isOpen = useMemo(() => !!conversationId, [conversationId]);
  return { isOpen, conversationId };
};
export default useConversation;
