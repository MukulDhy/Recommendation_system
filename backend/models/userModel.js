const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { forgotPasswordMailSent } = require("../controllers/userController");
const bcryptjs = require("bcryptjs");
const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter the FullName"],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Email address is required"],
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Please Enter the password"],
  },
  mobileNo: {
    type: String,
    required: [true, "Mobile number is required"],
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v); // Validate mobile number format (exactly 10 digits)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  viewHistory: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      viewedAt: { type: Date, default: Date.now },
    },
  ],
  interactions: [
    { productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" } },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

// Compare password with hash password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};
userSchema.methods.gernateToken = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_KEY, {
    expiresIn: "56h",
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
