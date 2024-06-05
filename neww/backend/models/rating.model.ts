require("dotenv").config({ path: "../config/config.env" });
import mongoose, { Document, Schema, Model, models, ObjectId } from "mongoose";


export interface IRating {
  shop_id : ObjectId;  
  user: ObjectId;
  value: number;
  comment: string;
}