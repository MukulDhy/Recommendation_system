import mongoose from "mongoose";
require("dotenv").config({ path: "../config/config.env" });
const dbUrl: string = process.env.DB_URI || "";
import colors from "colors";
colors.enable();
const connectDataBase = async () => {
  try {
    if (dbUrl === "") {
      const connected: any = await mongoose.connect(process.env.DB_URL || "");

      console.log(
        `DataBase is Succefully Connected with ${connected.connection.host}`
          .bgCyan.black.underline
      );
    } else {
      const connected: any = await mongoose.connect(dbUrl);

      console.log(
        `DataBase is Succefully Connected with ${connected.connection.host}`
          .bgCyan.black.underline
      );
    }
  } catch (error: any) {
    console.log(`Connection to Database Denied`.bgRed.white);
    console.log(`Error that Occured : ${error.message}`.bgRed.white);
    setTimeout(connectDataBase, 5000);
  }
};

export default connectDataBase;
