import { Navigate, useRoutes } from "react-router-dom";
import SetAvatar from "@pages/SetAvatar";
import Chat from "@pages/Chat";
import SignLog from "@pages/SignLog";
import { useAuth } from "@context/auth-context";

import { useMemo } from "react";
import { EmptyState } from "@components/EmptyState";

const GetRouters = () => {
  const { user } = useAuth();
  const routes = useMemo(
    () => [
      {
        path: "/",
        element: user ? <Navigate to='/chat' /> : <SignLog />,
      },
      {
        path: "/chat",
        element: user ? <Chat /> : <Navigate to='/' />,
        children: [
          {
            //默认展示这个子路由
            index: true,
            element: <EmptyState />,
          },
          {
            path: "users",
            element: <EmptyState />,
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
            <Navigate to='/chat' />
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
