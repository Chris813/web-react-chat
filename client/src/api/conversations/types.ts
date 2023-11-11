import { User } from "@api/auth/types";

export interface MessageProp {
  id?: string;
  sender: User;
  senderId: string;
  seenIds: string[];
  seen?: User[];
  createdAt: string;
  image?: string;
  body?: string;
  conversationId: string;
  conversation?: ConversationProp;
}

export interface ConversationProp {
  id: string;
  name: string;
  isGroup: boolean;
  members: string[];
  messages: MessageProp[];
  createdAt: string;
  lastMessageAt: string;
  messagesIds: string[];
  userIds: string[];
  users: User[];
}
