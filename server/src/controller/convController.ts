import { Request, Response } from "express";
import { prisma } from "../../libs/prismadb";
import cloudinary from "cloudinary";
import { ca } from "date-fns/locale";
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
  const conversationId = req.params.id;
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

const cloudy = cloudinary.v2;
cloudy.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// const uploadImage = async (image: string) => {
//   return await
// };

export const sendMessages = async (req: Request, res: Response) => {
  console.log("sendMessages");
  const conversationId = req.params.id;
  const { body } = req.body;
  const text = body.text;
  const image = body.image;
  const currentUser = req.body.user;

  let result = { secure_url: "" };
  if (image) {
    result = await cloudy.uploader.upload(image, { folder: "chat" });
  }
  try {
    const newMessage = await prisma.message.create({
      data: {
        body: text,
        image: result.secure_url || "",
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        sender: true,
        seen: true,
      },
    });
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
        lastMessageAt: new Date(),
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });
    return res.status(200).json({
      status: "success",
      data: {
        message: newMessage,
      },
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      msg: "发送消息失败",
    });
  }
};

export const seenMessages = async (req: Request, res: Response) => {
  const conversationId = req.params.id;
  console.log("seenMessages", conversationId);
  const currentUser = req.body.user;
  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });
    if (!conversation) {
      return res.status(400).json({
        status: "fail",
        msg: "会话不存在",
      });
    }
    //获取所有未读信息
    const unSeenMessages = conversation.messages.filter(
      (message) => !message.seenIds.includes(currentUser.id)
    );
    //更新所有未读信息为已读
    const updatedMessages = await Promise.all(
      unSeenMessages.map((message) => {
        return prisma.message.update({
          where: {
            id: message.id,
          },
          data: {
            seen: {
              connect: {
                id: currentUser.id,
              },
            },
          },
        });
      })
    );
    return res.status(200).json({
      status: "success",
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      msg: "更新消息失败",
    });
  }
};

export const deleteConversationById = async (req: Request, res: Response) => {
  const conversationId = req.params.id;
  const currentUser = req.body.user;
  try {
    const existinfConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    if (!existinfConversation) {
      return res.status(400).json({
        status: "fail",
        msg: "该聊天不存在",
      });
    }
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });
    return res.status(200).json({
      status: "success",
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      msg: "删除会话失败",
    });
  }
};
