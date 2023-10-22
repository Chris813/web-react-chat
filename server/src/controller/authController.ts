import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../../libs/prismadb";
import bcrypt from "bcrypt";
import AppError from "../../utils/AppError";
import { createSendToken, signToken } from "../../utils/auth";

import { get } from "lodash";
const CLIENT_URL = "http://localhost:3000";
import axios from "axios";
import quereystring from "querystring";
import { User } from "@prisma/client";
import { IGetUserAuthInfoRequest } from "./types";

const COOKIE_NAME = "chat-app-token";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, password, email } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        status: "fail",
        msg: "Please provide email, password and name",
      });
    }
    const emailCheck = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (emailCheck) {
      return res
        .status(400)
        .json({ status: "fail", msg: "Email already exists" });
    }
    const nameCheck = await prisma.user.findUnique({
      where: {
        name,
      },
    });
    if (nameCheck) {
      return res
        .status(400)
        .json({ status: "fail", msg: "Name already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });
    createSendToken(user, 201, res);
  } catch (err) {
    return next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        msg: "Please provide email and password",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        msg: "邮箱不存在！",
      });
    }
    if (!user.hashedPassword) {
      return res.status(400).json({
        status: "fail",
        msg: "请使用第三方登录",
      });
    } else {
      const isCorrect = await bcrypt.compare(password, user.hashedPassword);
      if (!isCorrect) {
        return res.status(400).json({
          status: "fail",
          msg: "密码错误！",
        });
      }
      createSendToken(user, 200, res);
    }
  } catch (err) {
    return next(err);
  }
};

async function setGithubToken(code: string) {
  const tokenurl = `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_ID}&client_secret=${process.env.GITHUB_SECRET}&code=${code}`;
  console.log(tokenurl);
  const githubToken = await axios
    .post(tokenurl)
    .then((res) => res.data)
    .catch((err) => console.log("githubusererror"));

  const decoded = quereystring.parse(githubToken);
  const accessToken = decoded.access_token;
  const githubUser = await axios
    .get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log("getuser error"));
  if (githubUser) {
    let user = await prisma.user.findUnique({
      where: {
        name: githubUser.login,
      },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: githubUser.login,
          email: githubUser.email,
          image: githubUser.avatar_url,
        },
      });
      const account = await prisma.account.create({
        data: {
          userId: user.id,
          provider: "github",
          type: "oauth",
          access_token: accessToken as string,
          providerAccountId: String(githubUser.id),
        },
      });
    }

    return user;
  } else {
    throw new AppError("githubusererror", 400);
  }
}

export const gitCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("callback");
  const code = get(req.query, "code");
  if (!code) {
    return res.status(400).json({
      status: "fail",
      msg: "code is null",
    });
  }
  const user = await setGithubToken(code as string);
  if (user) {
    const token = signToken(user.id);
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
      ),
      secure: false,
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    const data = {
      token,
      user,
    };
    res.cookie(COOKIE_NAME, data, cookieOptions);
  }
  res.redirect(CLIENT_URL);
};

export const getSocialToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    return res.status(400).json({
      status: "fail",
      msg: "cookie is null",
    });
  } else {
    return res.status(200).json({
      status: "success",
      token,
    });
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const decoded = await jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await prisma.user.findUnique({
      where: {
        id: typeof decoded === "string" ? "" : decoded.id,
      },
    });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        msg: "用户未授权",
      });
    }
    req.body.user = user;
    next();
  } catch (err) {
    // if ((err as TokenExpiredError).name === "TokenExpiredError") {
    //   res.status(401).json({ message: "Token expired" });
    // } else {
    //   // 其他 JWT 验证错误，返回适当的错误响应
    //   res.status(401).json({ message: "Authentication failed" });
    // }
  }
};
