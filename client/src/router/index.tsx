import { Navigate, useRoutes } from "react-router-dom";
import SetAvatar from "@pages/SetAvatar";
import Chat from "@pages/Chat";
import SignLog from "@pages/SignLog";
import { useAuth } from "@context/auth-context";

import { useMemo } from "react";
import { EmptyState } from "@components/EmptyState";
import User from "@components/users/User";
import Conversation from "@components/conversations/Conversation";
import ConversationId from "@components/conversations/ConversationId";

const GetRouters = () => {
  const { user } = useAuth();
  const routes = useMemo(
    () => [
      {
        path: "/",
        element: user ? <Navigate to='/chat/conversation' /> : <SignLog />,
      },
      {
        path: "/chat",
        element: user ? <Chat /> : <Navigate to='/' />,
        children: [
          {
            //默认展示这个子路由
            path: "conversation",
            element: <Conversation />,
            children: [
              {
                index: true,
                element: <EmptyState />,
              },
              {
                path: ":id",
                element: <ConversationId />,
              },
            ],
          },
          {
            path: "users",
            element: <User />,
          },
          {
            path: "#",
            element: <EmptyState />,
          },
        ],
      },
      {
        path: "/setAvatar",
        element: user ? (
          user.image ? (
            <Navigate to='/chat/conversation' />
          ) : (
            <SetAvatar />
          )
        ) : (
          <Navigate to='/' />
        ),
      },
    ],
    [user]
  );
  const routeResult = useRoutes(routes);
  return routeResult;
};
export default GetRouters;
