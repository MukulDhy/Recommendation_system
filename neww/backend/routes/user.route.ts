import express from "express";
import {
  activateUser,
  getUserInfo,
  loginUser,
  logout,
  registerUser,
  socialAuth,
  updateUserProfile,
  forgotPasswordMailSent,
  forgotActivationCode,
  setNewPassword,
} from "../controllers/userController";
import { authentication } from "../middleware/auth";

const userRoute = express.Router();

userRoute.route("/register").post(registerUser);
userRoute.route("/activate").post(activateUser);
userRoute.route("/login").get(loginUser);
userRoute.route("/logout").get(authentication, logout);
userRoute.route("/me").get(authentication, getUserInfo);
userRoute.route("/social-auth").post(socialAuth);
userRoute.route("/update").put(authentication, updateUserProfile);
userRoute
  .route("/forgot-password")
  .post(forgotPasswordMailSent)
  .get(forgotActivationCode)
  .put(authentication, setNewPassword);

export default userRoute;
