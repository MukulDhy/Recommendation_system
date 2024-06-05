import { redis } from "../connection/redisConnection";
import { IUser } from "../models/user.model";
import ErrorHandler from "./ErrorHandler";

export const isLoginUserBlocked = async (
  user: IUser,
  next: any
): Promise<any> => {
  try {
    const blockedUntil = await redis.get(`loginBlocked:${user._id}`);
    if (blockedUntil && Date.now() < parseInt(blockedUntil)) {
      return new Date(parseInt(blockedUntil));
    }
    return null;
  } catch (error: any) {
    throw new ErrorHandler(error.message, 400);
  }
};

export const loginBlocked = async (user: IUser): Promise<boolean> => {
  try {
    const failedAttemptsKey = `failed_attempts:${user._id}`;
    await redis.incr(failedAttemptsKey);
    const failedAttemptsCount: string =
      (await redis.get(failedAttemptsKey)) || "0";

    if (parseInt(failedAttemptsCount) >= 5) {
      await setLoginBlocked(user._id);
      await redis.del(failedAttemptsKey);
      return true;
    }
    return false;
  } catch (error: any) {
    throw new ErrorHandler(error.message, 400);
  }
};

async function setLoginBlocked(userId: any) {
  const blockedUntilTimestamp = Date.now() + 5 * 60 * 1000; // 5 minutes from now
  await redis.set(
    `loginBlocked:${userId}`,
    blockedUntilTimestamp,
    "PX",
    5 * 60 * 1000
  ); // Set expiration time to 5 minutes
}

export const clearLoginFailedAttempts = async (userId: any): Promise<void> => {
  await redis.del(`failed_attempts:${userId}`);
};
