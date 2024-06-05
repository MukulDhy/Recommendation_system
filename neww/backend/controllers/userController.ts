import { Response, Request, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { gernateActivationToken } from "../utils/gernateActivationToken";
import colors from "colors";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import sendToken, {
  ITokenOptions,
  accessTokenOptions,
  refreshTokenOptions,
} from "../utils/sendToken";
import { redis } from "../connection/redisConnection";
import {
  clearLoginFailedAttempts,
  isLoginUserBlocked,
  loginBlocked,
} from "../utils/userBlocked";
import { isAwaitKeyword } from "typescript";
import {
  getUserByIdFromDb,
  getUserByIdFromRedis,
} from "../services/user.service";
import cloudinary from "cloudinary";
colors.enable();

/* Registration Controller */
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}
export const registerUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(`Start Registering a User`.bgWhite.black);

      const { name, email, password } = req.body;
      if (!email || !password || !name) {
        return next(new ErrorHandler("Please Enter the Details", 401));
      }

      const isEmailExist = await User.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email already Exist", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationObject = gernateActivationToken(user);

      const activationCode = activationObject.activationCode;

      const data = { user: { name: user.name }, activationCode };

      const html = await ejs.renderFile(
        path.join(__dirname, "../templates/activation_mail.ejs"),
        data
      );

      try {
        console.log(`Sending Mail to ${user.email}`);
        await sendMail({
          email: user.email,
          subject: "Account Activation Mail",
          template: "activation_mail.ejs",
          data,
        });
        console.log(`Mail Sent Successfully`);

        res.status(201).json({
          success: true,
          message: `Please Check your email ${user.email} to activate your account`,
          activation_token: activationObject.token,
        });
      } catch (error: any) {
        console.log(`Error Occured in sending the Email`.bgRed.black);
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      console.log(`Error Occured in Registering a User`.black.bgRed);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/* Activate User */
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid Activation Code", 400));
      }

      const { name, email, password } = newUser.user;

      const isEmailExist = await User.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email is Already Exist", 400));
      }

      const user = await User.create({ name, email, password });
      console.log(`Successfully Register a User`.black.bgGreen);

      sendToken(user,200,res);
      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/* Login User  */
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      console.log(`Staring Login User`.bgWhite.black);

      if (!email || !password) {
        return next(new ErrorHandler("Please Enter valid email", 400));
      }

      const user: IUser = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(
          new ErrorHandler("User does'nt Exist || Enter valid email", 201)
        );
      }

      // Check if the user is blocked
      const blockedUntil = await isLoginUserBlocked(user, res);

      if (blockedUntil) {
        return next(
          new ErrorHandler(
            `Your session is blocked until ${blockedUntil} or try to contact with community`,
            400
          )
        );
        res.status(400).json({
          success: false,
          message: `Your session is blocked Pease contact with community`,
        });
      }

      if (!(await user.comparePassword(password))) {
        const isLoginBlocked: boolean = await loginBlocked(user);
        if (isLoginBlocked) {
          return next(
            new ErrorHandler(
              `Your session has been blocked due to many time wrong password`,
              400
            )
          );
        }
        return next(
          new ErrorHandler("Password is Wrong try another password", 400)
        );
      }
      await clearLoginFailedAttempts(user._id);
      console.log(`Successfully Login`.bgGreen.black);

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Logout
export const logout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", null, {
        expires: new Date(Date.now()),
        maxAge: 1,
      });
    
      redis.del(req.user?._id);

      console.log("LogOut User".bgRed.black);

      res.status(200).json({
        success: true,
        message: "Logout Successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// Getuser Info
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    const user = await getUserByIdFromRedis(userId, res);

    res.status(201).json({
      success: true,
      user,
    });
  }
);

// Social auth login
interface socialAuthBody {
  name: string;
  email: string;
  avatar: string;
}
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, avatar }: socialAuthBody = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      const newuser = await User.create({ email, name, avatar });
      sendToken(newuser, 200, res);
    } else {
      sendToken(user, 200, res);
    }
  }
);

// updateUser profile including the avatar
interface updateUserProfileBody {
  name?: string;
  email?: string;
  avatarUrl?: string;
}
interface UploadingProfilePicture {
  public_id: string;
  url: string;
}

export const updateUserProfile = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, avatarUrl } = req.body as updateUserProfileBody;
      const userId = req.user?._id;
      const user = (await User.findById(userId)) as IUser;
      if (email && email !== user.email) {
        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
          return next(new ErrorHandler(`This Email is already Exist`, 400));
        }
      }
      if (
        Object.keys(req.body).length === 0 ||
        (!name && !email && !avatarUrl)
      ) {
        // const user: IUser = (await User.findById(userId)) as IUser;
        return sendToken(user, 200, res, "User Don't have any Update");
      }
      let avatar: Partial<UploadingProfilePicture> | undefined;

      // If avatar URL is provided, upload new avatar to cloudinary
      if (avatarUrl && user) {
        // If user already has a profile picture, delete it
        if (user.avatar?.public_id) {
          await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        }

        console.log(`Saving picture to the Cloudinary`.bgWhite.black);
        // Upload new avatar to cloudinary
        const myCloud = await cloudinary.v2.uploader.upload(avatarUrl, {
          folder: "avatars",
          width: 150,
        });
        console.log(`Picture save to  Cloudinary`.bgGreen.white);
        // Adding the cloudainary obejct to the DB
        avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      // Update user profile
      const updatedUser = (await User.findByIdAndUpdate(
        userId,
        { name, email, avatar },
        { new: true }
      )) as IUser;

      sendToken(updatedUser, 200, res, "User Updated Successfully");
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
interface forgotPasswordBody {
  email: string;
}

interface authenticateBody {
  access_token?: string;
  refresh_token?: string;
}
export const forgotPasswordMailSent = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens: authenticateBody = req.cookies;

      if (tokens.refresh_token) {
        try {
          const decoded = jwt.verify(
            tokens.refresh_token,
            process.env.REFRESH_TOKEN as Secret
          ) as JwtPayload;

          if (decoded.id) {
            const sessionUser = await redis.get(decoded.id);
            if (sessionUser) {
              await redis.del(decoded.id);
            }
            res.cookie("access_token", null, {
              expires: new Date(Date.now()),
              maxAge: 1,
            });
            res.cookie("refresh_token", null, {
              expires: new Date(Date.now()),
              maxAge: 1,
            });
            console.log("User Session Info Deleted".bgRed.black);
          }
        } catch (error: any) {
          console.log(error.message);
          return next(new ErrorHandler(error.message, 400));
        }
      }

      const { email } = req.body as forgotPasswordBody;

      const user = await User.findOne({ email });

      if (!user) {
        return next(
          new ErrorHandler("Accont Does'nt Exist || Register Yourself", 400)
        );
      }

      const activationObject = gernateActivationToken(user._id);

      const activationCode = activationObject.activationCode;

      const data = { user: { name: user.name }, activationCode };

      const html = await ejs.renderFile(
        path.join(__dirname, "../templates/forgot_mail.ejs"),
        data
      );

      try {
        console.log(`Sending Mail to ${user.email}`);
        await sendMail({
          email: user.email,
          subject: "Password Reset Email",
          template: "forgot_mail.ejs",
          data,
        });
        console.log(`Mail Sent Successfully`);

        res.status(201).json({
          success: true,
          message: `Please Check your email ${user.email}. We have sent you code to reset your password`,
          activation_token: activationObject.token,
        });
      } catch (error: any) {
        console.log(`Error Occured in sending the Email`.bgRed.black);
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      console.log(`Error Occured in Forgoting a User`.black.bgRed);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/* BETTER : "This code is repeater again and again can be better" */
/* Forgot-Password Activate-code */
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const forgotActivationCode = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const tokenData: { user: string; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: string; activationCode: string };

      if (tokenData.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid Activation Code", 400));
      }

      const user = (await User.findById(tokenData.user)) as IUser;

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

/* Update the password after forgeting it */
interface newPasswordBody {
  password: string;
}
export const setNewPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password } = req.body as newPasswordBody;

      if (!password) {
        return next(new ErrorHandler("Please provide the valid password", 400));
      }

      const userId = req.user?._id;
      const user = await User.findById(userId).select("+password");
      if (user?.password === undefined) {
        return next(
          new ErrorHandler("Invalid User || May be you login from Google", 400)
        );
      }
      user.password = password;
      await user.save();
      sendToken(user, 200, res, "Password Changed Successfully");
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
