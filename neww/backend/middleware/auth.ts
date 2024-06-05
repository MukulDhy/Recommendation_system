require("dotenv").config({ path: "../config/config.env" });
import { Response, Request, NextFunction } from "express";
/* For Declaring the req.user  */
declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Change `any` to the actual type of `user` if possible
    }
  }
}

import { CatchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { redis } from "../connection/redisConnection";

interface authenticateBody {
  access_token: string;
  refresh_token: string;
}
// authenticate user
export const authentication = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { access_token}: authenticateBody = req.cookies;
    try {
      if (!(access_token)) {
        return next(
          new ErrorHandler(`Please login to access these resources`, 401)
        );
      }
      if (!access_token) {
        return next(
          new ErrorHandler(`Please login to access these resources`, 401)
        );
      }
      const decoded = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN as Secret
      ) as JwtPayload;
      if (!decoded) {
        return next(new ErrorHandler(`Invalid token or token Expired`, 400));
      }
      const user = await redis.get(decoded.id);
      // const user:IUser = await User.findById(decoded.id) as IUser;

      if (!user) {
        return next(new ErrorHandler(`user not found`, 400));
      }

      req.user = JSON.parse(user);

      next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const authoricationRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role : ${req.user?.role} is not allowded to use this resources`,
          403
        )
      );
    }
  };
};
