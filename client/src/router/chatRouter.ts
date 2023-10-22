import { HiChatAlt2 } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import useConversation from "@hooks/useConversation";
import { useAuth } from "@context/auth-context";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export const useChatRoutes = () => {
  const { pathname } = useLocation();

  const lastPathName = pathname.split("/")[pathname.split("/").length - 1];
  console.log(lastPathName);
  const { logout } = useAuth();
  const { conversationId } = useConversation();
  const routes = useMemo(
    () => [
      {
        label: "Chat",
        icon: HiChatAlt2,
        path: "conversation",
        active: lastPathName === "chat" || !!conversationId,
      },
      {
        label: "Users",
        path: "users",
        icon: HiUsers,
        active: lastPathName === "users",
      },
      //logout route
      {
        label: "Logout",
        path: "#",
        icon: HiArrowLeftOnRectangle,
        onClick: () => {
          logout();
        },
      },
    ],
    [lastPathName, conversationId]
  );

  return routes;
};
