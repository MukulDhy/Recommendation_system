require("dotenv").config({ path: "../config/config.env" });
import mongoose, {
  Document,
  Schema,
  Model,
  models,
  mongo,
  ObjectId,
} from "mongoose";

const pincodeRegexPatter: RegExp = /^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$/;

export interface IRetailer extends Document {
  user : ObjectId;
  shop_id: ObjectId;
  gst: string;
  numberOfShop: number;
  contact: number;
  address: {
    addressLine1: string;
    addressLine2: string;
    state: string;
    city: string;
    pincode: string;
  };
  aadharCard: {
    number: number;
    name: string;
    address: {
      addressLine1: string;
      addressLine2: string;
      state: string;
      city: string;
      pincode: string;
    };
  };
  isVerified: string;
}

const retailerSchema: Schema<IRetailer> = new mongoose.Schema({
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
  gst: {
    type: String,
    default: "Not Available",
  },
  numberOfShop: Number,
  contact: Number,
  address: {
    type: {
      addressLine1: String,
      addressLine2: String,
      state: String,
      city: String,
      pincode: {
        type: String,
        required: true,
        validate: {
          validator: function (value: string) {
            return pincodeRegexPatter.test(value);
          },
          message: "Please Enter the Valid pincode",
        },
        // match: pincodeRegexPatter // applying pincode regex pattern validation
      },
    },
    required: true,
  },
  aadharCard: {
    type: {
      number: Number,
      name: String,
      address: {
        type: {
          addressLine1: String,
          addressLine2: String,
          state: String,
          city: String,
          pincode: {
            type: String,
            required: true,
            validate: {
              validator: function (value: string) {
                return pincodeRegexPatter.test(value);
              },
              message: "Please Enter the Valid pincode",
            },
            // match: pincodeRegexPatter // applying pincode regex pattern validation
          },
        },
        required: true,
      },
    },
    required: true,
  },
  isVerified: { type: String, default: "NOT" },
});

const Retailer:Model<IRetailer> = mongoose.model("Retailer",retailerSchema);

export default Retailer;