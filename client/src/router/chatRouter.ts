import { HiChatAlt2 } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import useConversation from "@hooks/useConversation";
import { useAuth } from "@context/auth-context";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export const useChatRoutes = () => {
  const { pathname } = useLocation();

  const pathNames = pathname.split("/");
  const { logout } = useAuth();
  const { conversationId } = useConversation();
  const routes = useMemo(
    () => [
      {
        label: "Chat",
        icon: HiChatAlt2,
        path: "conversation",
        active: pathNames.includes("conversation") || !!conversationId,
      },
      {
        label: "Users",
        path: "users",
        icon: HiUsers,
        active: pathNames.includes("users"),
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
    [pathNames, conversationId]
  );

  return routes;
};
