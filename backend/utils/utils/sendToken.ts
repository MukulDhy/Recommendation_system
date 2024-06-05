require("dotenv").config({ path: "../config/config.env" });
const jwt = require("jsonwebtoken");

// parse environment variables to integrate with fallback values
const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_COOKIE_EXPIRE || "300",
  10
);
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_COOKIE_EXPIRE || "300",
  10
);


const accessTokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

const sendToken = (
  user,
  statusCode,
  res,
  message = "User logged in successfully"
) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();


  clearLoginFailedAttempts(user._id);

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    message: message,
    user,
    accessToken,
  });
};

module.exports = sendToken;
