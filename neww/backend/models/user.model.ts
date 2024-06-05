require("dotenv").config({ path: "../config/config.env" });
import mongoose, { Document, Schema, Model, models } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber: Number;
  // avatar: {
  //   public_id: string;
  //   url: string;
  // };
  // role: string;
  // isVerified: boolean;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please Enter the email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please Enter the Valid mail Id",
      },
      unique: true,
    },
    password: {
      type: String,
    },
    viewHistory: [{ productId:{
      type : mongoose.Schema.Types.ObjectId,

    } , viewedAt: Date }]

    },
  { timestamps: true }
);

// Hash Password
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

// Sign Access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign(
    { id: this._id },
    (process.env.ACCESS_TOKEN as Secret) || "",
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
  );
};

// Compare password with hash password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcryptjs.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model("User", userSchema);

export default User;
