import { useMemo } from "react";
import { User } from "@api/auth/types";
import { ConversationProp } from "@api/conversations/types";
import { useAuth } from "@context/auth-context";

const useOtherUser = (coversation: ConversationProp | { users: User[] }) => {
  const { user } = useAuth() as { user: User };
  const otherUser = useMemo(() => {
    return coversation.users.find((u) => u.id !== user.id) as User;
  }, [coversation, user]);
  return otherUser;
};

export default useOtherUser;
