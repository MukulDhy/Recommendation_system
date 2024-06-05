require("dotenv").config({ path: "../config/config.env" });
const jwt = require("jsonwebtoken");

const sendToken = (
  user,
  statusCode,
  res,
  token,
  message = "User logged in successfully"
) => {
  // const token = user.gernateJWTtoken();

  const tokenOption = {
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    maxAge: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    // httpOnly: true,
    // sameSite: "lax",
  };

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("token", token, tokenOption);

  res.status(statusCode).json({
    success: true,
    message: message,
    user,
    token,
  });
};

module.exports = sendToken;
