import { Request, Response } from "express";
import { prisma } from "../../libs/prismadb";
import { User } from "@prisma/client";
export const createConversation = async (req: Request, res: Response) => {
  try {
    const { userId, isGroup, members, name } = req.body;
    const currentUser = req.body.user;

    if (isGroup && (!members || members.length < 2 || !name)) {
      return res.status(400).json({
        status: "fail",
        msg: "无效的群聊信息",
      });
    }
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });
      return res.status(201).json({
        status: "success",
        data: {
          conversation: newConversation,
        },
      });
    }
    const exisitingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
      include: {
        users: true,
      },
    });
    const singleConversation = exisitingConversations[0];
    if (singleConversation) {
      return res.status(200).json({
        status: "success",
        data: {
          conversation: singleConversation,
        },
      });
    }
    const newConversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });
    return res.status(200).json({
      status: "success",
      data: {
        conversation: newConversation,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      msg: "创建会话失败",
    });
  }
};
