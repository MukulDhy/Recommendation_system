const express = require("express");
const {
  allProduct,
  getSingleProduct,
  getAllCategories,
  updateViewHistory,
  updateLikedProduct,
  removeProductFromViewHistory,
  getTrendingProducts,
  getMostLikedProducts,
  getRecommendedProduct,
} = require("../controllers/productController");
const {
  isAuthorization,
  authorizationRole,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/all").get(allProduct);
router.route("/categories").get(getAllCategories);

router
  .route("/find/:productId")
  .get(isAuthorization, updateViewHistory, getSingleProduct);

router.route("/rate/:productId").post(isAuthorization, updateLikedProduct);

router.route("/trending").get(getTrendingProducts);

router.route("/most-liked").get(getMostLikedProducts);

router
  .route("/deleteHistory/:productId")
  .post(isAuthorization, removeProductFromViewHistory);

router.route("/recommend").get(isAuthorization, getRecommendedProduct);

module.exports = router;
