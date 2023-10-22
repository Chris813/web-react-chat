import { getToken } from "@api/auth";
import service from "@utils/requestAxios";

interface CreateProps {
  userId: string;
  isGroup?: boolean;
  members?: string[];
  name?: string;
}

export const creatConversation = async (data: CreateProps) => {
  return await service.post("/conversations", JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken() || "",
    },
  });
};
