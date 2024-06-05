import dotenv from "dotenv";
dotenv.config({ path: "config/config.env" });
import { NextFunction, Response, Request } from "express";
import app from "./app";
import { v2 as cloudinary } from "cloudinary";
import colors from "colors";
colors.enable();

import connectDataBase from "./connection/dbConnection";

/* Config the cloudainary  */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDNAIRY_API_KEY,
  api_secret: process.env.CLOUDNAIRY_SECRET_KEY,
});

console.log(
  `Cloudinary is Connected to ${process.env.CLOUDINARY_NAME}`.bgCyan.black
    .underline
);

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT}`.bgCyan.black.underline
  );
  connectDataBase();
});
