import { User } from "@prisma/client";
import { Request } from "express";
export interface IGetUserAuthInfoRequest extends Request {
  user: User; // or any other type
}
