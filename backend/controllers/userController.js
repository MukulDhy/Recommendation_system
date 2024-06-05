const express = require("express");
const User = require("../models/userModel");
const CatchAsyncError = require("../middlewares/catchAsyncError.js");
const ErrorHandler = require("../utils/ErrorHandler");
const { gernateActivationToken } = require("../utils/gernateActivationToken");
const colors = require("colors");
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/sendToken.js");
const cloudinary = require("cloudinary").v2;
colors.enable();

/* Registration Controller */
const registerUser = CatchAsyncError(async (req, res, next) => {
  try {
    console.log(`Start Registering a User`.bgWhite.black);

    const { name, email, mobileNo, password } = req.body;
    // if () {
    //   return next(new ErrorHandler("Please Enter the Details", 401));
    // }

    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
      return next(new ErrorHandler("Email already Exist", 400));
    }
    console.log(req.body);
    const user = await User.create({
      name,
      email,
      mobileNo,
      password,
    });
    console.log(`Successfully Register a User`.black.bgGreen);

    // console.log(user.generateJWTtoken());
    const token = user.gernateToken();
    sendToken(user, 200, res, token);
  } catch (error) {
    console.log(`Error Occured in Registering a User`.black.bgRed);
    return next(new ErrorHandler(error.message, 400));
  }
});

/* Login User */
const loginUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(`Staring Login User`.bgWhite.black);

    if (!email || !password) {
      return next(
        new ErrorHandler("Please Enter valid email or password", 400)
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(
        new ErrorHandler("User does'nt Exist || Enter valid email", 201)
      );
    }

    if (!(await user.comparePassword(password))) {
      return next(
        new ErrorHandler("Password is Wrong try another password", 400)
      );
    }
    console.log(`Successfully Login`.bgGreen.black);
    const token = user.gernateToken();
    sendToken(user, 200, res, token);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Logout
const logout = CatchAsyncError(async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      maxAge: 1,
    });

    console.log("LogOut User".bgRed.black);

    res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Getuser Info
const getUserInfo = CatchAsyncError(async (req, res, next) => {
  const userId = req.user?._id;

  const user = await User.findById(userId);

  res.status(201).json({
    success: true,
    user,
  });
});

const getViewHistory = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user after authentication
    const user = await User.findById(userId).populate("viewHistory.productId");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, products: user.viewHistory });
  } catch (error) {
    console.error(`Error fetching view history: ${error}`);
    next(error);
  }
};
const getWishList = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("interactions.productId");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Your Wish List",
      products: user.interactions.map((interaction) => interaction.productId),
    });
  } catch (error) {
    console.error(`Error fetching wish list: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  getUserInfo,
  logout,
  loginUser,
  getViewHistory,
  getWishList,
};
