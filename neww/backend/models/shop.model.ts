require("dotenv").config({ path: "../config/config.env" });
import mongoose, { Document, Schema, Model, models, ObjectId } from "mongoose";

const pincodeRegexPattern: RegExp = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;

export interface IRating {
  user: ObjectId;
  value: number;
  comment: string;
}

export interface IShop extends Document {
  shop_id: number;
  retailer: ObjectId;
  user: ObjectId;
  shop_name: string;
  gst: string;
  authorizationLetter: string;
  averageRating: number;
  workingHour: {
    open: string;
    close: string;
  };
  ratings: IRating[];
  contactDetail: {
    number: number;
    alternate: number;
  };
  shop_address: {
    orgAddress: {
      addressLine1: string;
      addressLine2: string;
      addressLine3: string;
      state: string;
      city: string;
      pincode: string;
      country: string;
      landmark: string;
    };
    location: {
      latitude: number;
      longitude: number;
      link: string;
    };
  };
  isVerified: boolean;
}

const shopSchema: Schema<IShop> = new mongoose.Schema({
  shop_id: { type: Number, required: true },
  retailer: { type: Schema.Types.ObjectId, ref: "Retailer", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  shop_name: { type: String, required: true },
  gst: { type: String, required: true },
  authorizationLetter: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
  workingHour: {
    open: { type: String, required: true },
    close: { type: String, required: true },
  },
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      value: Number,
      comment: String,
    },
  ],
  contactDetail: {
    number: { type: Number, required: true },
    alternate: { type: Number },
  },
  shop_address: {
    orgAddress: {
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      addressLine3: { type: String },
      state: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true, match: pincodeRegexPattern },
      country: { type: String, required: true },
      landmark: { type: String },
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      link: { type: String },
    },
  },
  isVerified: { type: Boolean, default: false },
});

const Shop: Model<IShop> = mongoose.model<IShop>("Shop", shopSchema);

export default Shop;
