//模拟第三方提供的登录服务
import { FieldValues } from "react-hook-form";
import { User, resProps } from "./types";
import service from "@utils/requestAxios";
const localStorageKey = "__auth_provider_token__";

export const getToken = () => localStorage.getItem(localStorageKey);

export const handleUserResponse = (res: resProps) => {
  localStorage.setItem(localStorageKey, res.token || "");
  const user = { ...res.user, token: res.token };
  return user as User;
};
export const handleAvatarResponse = (res: resProps) => {
  const image = res.image || "";
  localStorage.setItem("__user_avatar__", image || "");
  return image;
};
export const login = (data: FieldValues) => {
  return service
    .post("/auth/login", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      return handleUserResponse(res.data);
    });
};

export const register = (data: FieldValues) => {
  return service
    .post("/auth/register", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      return handleUserResponse(res.data);
    });
};
export const addAvatar = (image: string) => {
  return service
    .post("/user/avatar", JSON.stringify({ image }), {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken() || "",
      },
    })
    .then(async (res) => {
      return handleAvatarResponse(res.data);
    });
};
export const logout = async () => localStorage.removeItem(localStorageKey);
