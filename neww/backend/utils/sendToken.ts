require("dotenv").config({ path: "../config/config.env" });
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "../connection/redisConnection";
import { clearLoginFailedAttempts } from "./userBlocked";
import jwt, { Secret } from "jsonwebtoken";

export interface ITokenOptions {
  expires: Date;
  httpOnly: boolean;
  maxAge: number;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// parse enviroment variables to integrates with fallback values
const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_COOKIE_EXPIRE || "300",
  10
);
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_COOKIE_EXPIRE || "300",
  10
);

// Options for cookies
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

const sendToken = (
  user: IUser,
  statusCode: number,
  res: Response,
  message: string = "User logged in successfully"
) => {
  const accessToken = user.SignAccessToken();

  // CHECKING: Token Expiration
  // const data1 = jwt.verify(accessToken, process.env.ACCESS_TOKEN as Secret, {
  //   complete: true,
  // });
  // console.log(data1);

  // upload session to the redis

  redis.set(user._id, JSON.stringify(user) as any);
  clearLoginFailedAttempts(user._id);

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);

  res.status(statusCode).json({
    success: true,
    message: message,
    user,
    accessToken,
  });
};

export default sendToken;
