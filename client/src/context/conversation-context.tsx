import { getConversations } from "@api/conversations";
import { ConversationProp } from "@api/conversations/types";
import { useMount } from "@utils/use";
import { ReactNode, createContext, useContext, useState } from "react";

interface ConvContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  conversations: ConversationProp[] | null;
  setConversation: React.Dispatch<
    React.SetStateAction<ConversationProp[] | null>
  >;
}

const ConvContext = createContext<ConvContextType>({} as ConvContextType);
export const ConvProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversation] = useState<ConversationProp[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  useMount(() => {
    setIsLoading(true);
    getConversations().then((res) => {
      setConversation(res.data.data.conversations);
      setIsLoading(false);
    });
  });
  return (
    <ConvContext.Provider
      value={{ isLoading, setIsLoading, conversations, setConversation }}>
      {children}
    </ConvContext.Provider>
  );
};

export const useConv = () => {
  const context = useContext(ConvContext);
  if (context === undefined) {
    throw new Error("useConv must be used within a ConvProvider");
  }
  return context;
};
