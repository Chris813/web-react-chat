import { getToken } from "@api/auth";
import service from "@utils/requestAxios";

interface CreateProps {
  userId?: string;
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

export const getConversations = async () => {
  return await service.get("/conversations", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken() || "",
    },
  });
};

export const getConversationById = async (id: string) => {
  return await service.get(`/conversations/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken() || "",
    },
    params: {
      id,
    },
  });
};

export const getMessages = async (id: string) => {
  return await service.get(`/conversations/${id}/messages`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken() || "",
    },
  });
};

interface MessageProps {
  text?: string;
  image?: string;
}
export const sendMessage = async (id: string, body: MessageProps) => {
  return await service.post(
    `/conversations/${id}/messages`,
    JSON.stringify({ body }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken() || "",
      },
    }
  );
};

export const seenMessages = async (id: string) => {
  return await service.post(
    `/conversations/${id}/seen`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken() || "",
      },
    }
  );
};

export const deleteConversation = async (id: string) => {
  return await service.delete(`/conversations/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken() || "",
    },
  });
};
