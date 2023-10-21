import React, { ReactNode, useState } from "react";
import * as auth from "../api/auth/index";
import { User } from "api/auth/types";
import { FieldValues } from "react-hook-form";
import { http } from "@utils/requests";
import { useMount } from "@utils/use";

interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loginApi: (form: FieldValues) => Promise<void>;
  registerApi: (form: FieldValues) => Promise<void>;
  setAvatarApi: (image: string) => Promise<void>;
  logout: () => Promise<void>;
}

//初始化user
const bootstrapUser = async () => {
  const token = auth.getToken();
  if (token) {
    const res = await http("/user/me", { token });
    return res.user;
  }
};

const AuthContext = React.createContext<AuthContextProps | undefined>(
  undefined
);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  //每次刷新后获取用户信息
  useMount(() => {
    bootstrapUser().then(setUser);
  });
  const [user, setUser] = useState<User | null>(null);
  const loginApi = (form: FieldValues) => {
    return auth.login(form).then(setUser);
  };
  const registerApi = (form: FieldValues) => {
    return auth.register(form).then(setUser);
  };
  const setAvatarApi = (image: string) => {
    return auth.addAvatar(image).then((image) => setUser({ ...user!, image }));
  };
  const logout = () => {
    return auth.logout().then(() => setUser(null));
  };
  return (
    <AuthContext.Provider
      value={{ user, setUser, loginApi, registerApi, setAvatarApi, logout }}
      children={children}
    />
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
