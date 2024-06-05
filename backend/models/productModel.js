const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const { forgotPasswordMailSent } = require("../controllers/userController");

// const validateEmail = function (email) {
//   const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//   return re.test(email);
// };

const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  price: String,
  tags: [String],
  category: String,
  image: String,
  ratings: [{ userId: mongoose.Schema.Types.ObjectId, rating: Number }],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
