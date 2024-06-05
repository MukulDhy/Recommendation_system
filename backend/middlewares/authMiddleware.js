const ErrorHandler = require("../utils/ErrorHandler");
const jsonwebToken = require("jsonwebtoken");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });
require("colors");

const isAuthorization = catchAsyncError(async (req, res, next) => {
  let token = req.cookies.token;
  // console.log(req.headers.authorization);
  // console.log("hellooo");
  if (!token) {
    token = req.body.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new ErrorHandler("Please login first", 401));
    }
  }
  // console.log(token);
  const data = jsonwebToken.verify(token, process.env.JWT_KEY);
  // console.log(data);
  const user = await User.findById(data.userId);
  if (!user) {
    return next(new ErrorHandler("Invalid Token", 401));
  }

  // console.log(req.user);
  req.user = user;
  // console.log(req.user);
  next();
});

const authorizationRole = (...roles) =>
  catchAsyncError(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role : ${req.user.role} is not allowed to access this resources.`,
          403
        )
      );
    }

    next();
  });

module.exports = { isAuthorization, authorizationRole };
