import { PrismaClient } from "@prisma/client";
//全局作用域定于prisma
declare global {
  var prisma: PrismaClient | undefined;
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  hashedPassword: string | null;
  createdAt: Date;
  updatedAt: Date;
  conversationIds: string[];
  seenMessageIds: string[];
}

export const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
