import { Response } from "express";
import { redis } from "../connection/redisConnection";
import User, { IUser } from "../models/user.model";

// Get user by Id from DataBase
export const getUserByIdFromDb = async (userId: string): Promise<IUser> => {
  const user = (await User.findById(userId)) as IUser;
  return user;
};

// Get user by Id from Redis
export const getUserByIdFromRedis = async (userId: string, res: Response) => {
  const session = await redis.get(userId);
  if (!session) {
    return res.status(400).json({
      success: false,
      message: "Session is not present in redis || login Again",
    });
  }
  const user = JSON.parse(session);
  return user;
};
