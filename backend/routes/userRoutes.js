const express = require("express");
const {
  registerUser,
  getUserInfo,
  logout,
  loginUser,
  getViewHistory,
  getWishList,
} = require("../controllers/userController");
const {
  isAuthorization,
  authorizationRole,
} = require("../middlewares/authMiddleware");
const {
  removeProductFromViewHistory,
  updateIntrecstions,
  removeProductFromIntresections,
} = require("../controllers/productController");

const router = express.Router();

router.route("/me").get(getUserInfo);

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router.route("/viewHistory").get(isAuthorization, getViewHistory);

router
  .route("/wishlist/:productId")
  .put(isAuthorization, updateIntrecstions)
  .delete(isAuthorization, removeProductFromIntresections);
router.route("/wishlist").get(isAuthorization, getWishList);

module.exports = router;
