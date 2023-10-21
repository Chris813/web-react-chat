import { User } from "@prisma/client";
import { NextFunction, Response, Request } from "express";
import { prisma } from "../../libs/prismadb";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { IGetUserAuthInfoRequest } from "./types";
const COOKIE_NAME = "chat-app-token";
interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}
export const getUser = async (req: Request, res: Response) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies[COOKIE_NAME]) {
      token = req.cookies[COOKIE_NAME];
    }
    if (!token) {
      return res.status(401).json({
        status: "fail",
        msg: "请先登录",
      });
    }
    const decoded: DecodedToken = (await jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )) as DecodedToken;
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        msg: "用户不存在",
      });
    }
    return user;
  } catch (err) {
    // if ((err as TokenExpiredError).name === "TokenExpiredError") {
    //   res.status(401).json({ message: "Token expired" });
    // } else {
    //   // 其他 JWT 验证错误，返回适当的错误响应
    //   res.status(401).json({ message: "Authentication failed" });
    // }
    throw err;
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await getUser(req, res);
    return res.status(200).json({
      status: "success",
      user: user,
    });
  } catch (err) {
    if ((err as TokenExpiredError).name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
    } else {
      // 其他 JWT 验证错误，返回适当的错误响应
      res.status(401).json({ message: "Authentication failed" });
    }
  }
};

export const setAvatar = async (req: Request, res: Response) => {
  try {
    const user = (await getUser(req, res)) as User;
    const { image } = req.body;
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        image: image,
      },
    });
    return res.status(200).json({
      status: "success",
      msg: "设置头像成功",
      image: image,
    });
  } catch (err) {
    console.log(err);
    // return res.status(400).json({
    //   status: "fail",
    //   msg: "设置头像失败",
    // });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    //prisma get all usersexcept current user
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: req.params.id,
        },
        //and other information
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    return res.status(200).json({
      status: "success",
      users: users,
    });
  } catch (err) {
    console.log(err);
  }
};
