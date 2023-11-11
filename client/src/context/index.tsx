import { ReactNode } from "react";
import { AuthProvider } from "./auth-context";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket-context";
import { ConvProvider } from "./conversation-context";
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <ConvProvider>
        <SocketProvider>
          <Toaster />
          {children}
        </SocketProvider>
      </ConvProvider>
    </AuthProvider>
  );
};
