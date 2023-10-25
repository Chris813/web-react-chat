import { ReactNode } from "react";
import { AuthProvider } from "./auth-context";
import { Toaster } from "react-hot-toast";
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <Toaster />
      {children}
    </AuthProvider>
  );
};
