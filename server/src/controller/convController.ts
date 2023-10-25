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

export const getConversations = async (req: Request, res: Response) => {
  const currentUser = req.body.user;
  try {
    // 最新的会话排在最前面
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      data: {
        conversations,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      msg: "获取聊天失败",
    });
  }
};

export const getConversationById = async (req: Request, res: Response) => {
  console.log("conversation");
  const conversationId = req.params.id;
  console.log(conversationId);
  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    if (!conversation) {
      return res.status(404).json({
        status: "fail",
        msg: "会话不存在",
      });
    }
    // if (!conversation.userIds.includes(currentUser.id)) {
    //   return res.status(403).json({
    //     status: "fail",
    //     msg: "无权限",
    //   });
    // }

    console.log(conversation);
    return res.status(200).json({
      status: "success",
      data: {
        conversation,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      msg: "获取聊天失败",
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const conversationId = req.params.id;
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return res.status(200).json({
      status: "success",
      data: {
        messages,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      msg: "获取消息失败",
    });
  }
};
