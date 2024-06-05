const { default: mongoose } = require("mongoose");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const ApiFeatures = require("../utils/ApiFeaturs");
const ErrorHandler = require("../utils/ErrorHandler");

const getSingleProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      product: product,
    });
  } catch (error) {
    console.error(`Error fetching Single Product: ${error}`);
    next(new ErrorHandler("Internal Server Error", 500));
  }
};

const updateViewHistory = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;
    console.log(req.user);

    const viewedAt = new Date();

    const user = await User.findById(userId);
    if (!user.viewHistory.some((item) => item.productId.equals(productId))) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          viewHistory: {
            productId: productId,
            viewedAt: viewedAt,
          },
        },
      });
    }

    next();
  } catch (error) {
    console.error(`Error updating view history: ${error}`);
    next(error);
  }
};

const updateIntrecstions = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;
    // console.log(req.user);
    // console.log(productId);

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    const user = await User.findById(userId);
    if (!user.interactions.some((item) => item.productId.equals(productId))) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          interactions: {
            productId: productId,
          },
        },
      });
    }
    res.status(200).json({
      success: true,
      message: "product liked sucessfully",
    });
    // next();
  } catch (error) {
    console.error(`Error updating WWishLsit : ${error}`);
    next(error);
  }
};

const updateLikedProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;
    // console.log(req.user);
    const rate = req.body.rating;

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (!product.ratings.some((item) => item.userId.equals(userId))) {
      await Product.findByIdAndUpdate(productId, {
        $addToSet: {
          ratings: {
            userId: userId,
            rating: rate,
          },
        },
      });
    }
    res.status(200).json({
      success: true,
      message: "product liked Successfully",
    });
  } catch (error) {
    console.error(`Error updating view history: ${error}`);
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    console.log(categories);
    res.json(categories);
  } catch (error) {
    console.error(`Error fetching category: ${error}`);
    next(new ErrorHandler("Internal Server Error", 500));
  }
};

const allProduct = async (req, res, next) => {
  try {
    const resultPerPage = 1000;
    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage); // Apply pagination directly after filtering

    const products = await apiFeature.query;

    res.status(200).json({
      success: true,
      products,
      resultPerPage,
      filteredProductsCount: products.length, // Count the filtered products directly
    });
  } catch (error) {
    console.error(`Error fetching Products: ${error}`);
    next(new ErrorHandler("Internal Server Error", 500));
  }
};

const removeProductFromViewHistory = async (req, res, next) => {
  try {
    console.log("dawdawd");
    const { productId } = req.params;
    const userId = req.user._id; // Assuming user ID is available in req.user after authentication
    console.log("remmoving");
    // Update user's view history
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { viewHistory: { productId: productId } } },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product removed from view history",
      user,
    });
  } catch (error) {
    console.error(`Error removing product from view history: ${error}`);
    next(error);
  }
};

const removeProductFromIntresections = async (req, res, next) => {
  try {
    console.log("dawdawd");
    const { productId } = req.params;
    const userId = req.user._id; // Assuming user ID is available in req.user after authentication
    console.log("remmoving");
    // Update user's view history
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { interactions: { productId: productId } } },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product removed from WishList",
      user,
    });
  } catch (error) {
    console.error(`Error removing product from view history: ${error}`);
    next(error);
  }
};

const getTrendingProducts = async (req, res, next) => {
  try {
    const daysAgo = 30;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    const trendingProducts = await User.aggregate([
      { $unwind: "$viewHistory" },
      { $match: { "viewHistory.viewedAt": { $gte: date } } },
      { $group: { _id: "$viewHistory.productId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          _id: "$_id",
          productId: "$_id",
          name: "$productDetails.name",
          description: "$productDetails.description",
          price: "$productDetails.price",
          category: "$productDetails.category",
          image: "$productDetails.image",
          viewCount: "$count",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Trending Product are - ",
      products: trendingProducts,
    });
  } catch (error) {
    console.error(`Error fetching trending products: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getMostLikedProducts = async (req, res, next) => {
  try {
    const mostLikedProducts = await Product.aggregate([
      { $unwind: "$ratings" },
      { $group: { _id: "$_id", averageRating: { $avg: "$ratings.rating" } } },
      { $sort: { averageRating: -1 } },
      { $limit: 8 }, // Limiting to top 10 most liked products
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          _id: "$_id",
          name: "$productDetails.name",
          description: "$productDetails.description",
          price: "$productDetails.price",
          category: "$productDetails.category",
          image: "$productDetails.image",
          averageRating: "$averageRating",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "most liked product",
      products: mostLikedProducts,
    });
  } catch (error) {
    console.error(`Error fetching most liked products: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// Reccomendation
const getUserViewHistory = async (userId) => {
  const user = await User.findById(userId).populate("viewHistory.productId");
  return user.viewHistory.map((view) => view.productId);
};

const extractFeatures = (viewedProducts) => {
  const categories = new Set();
  const names = [];
  const descriptions = [];

  viewedProducts.forEach((product) => {
    categories.add(product.category);
    names.push(product.name);
    descriptions.push(product.description);
  });

  return { categories: Array.from(categories), names, descriptions };
};

const findSimilarProducts = async (features) => {
  const { categories, names, descriptions } = features;

  const similarProducts = await Product.find({
    $or: [
      { category: { $in: categories } },
      { name: { $in: names } },
      { description: { $in: descriptions } },
    ],
  }).limit(10);

  return similarProducts;
};

const recommendProducts = async (userId) => {
  try {
    // Step 1: Fetch the user's view history
    const viewedProducts = await getUserViewHistory(userId);

    // Step 2: Extract features from viewed products
    const features = extractFeatures(viewedProducts);

    // Step 3: Find similar products
    const recommendations = await findSimilarProducts(features);

    return recommendations;
  } catch (error) {
    console.error(`Error recommending products: ${error}`);
    throw error;
  }
};

const getRecommendedProduct = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user
    const recommendedProducts = await recommendProducts(userId);

    res.status(200).json({
      success: true,
      message: "Recommendation Product",
      products: recommendedProducts,
    });
  } catch (error) {
    console.error(`Error fetching most liked products: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
module.exports = {
  getMostLikedProducts,
};

module.exports = {
  getSingleProduct,
  allProduct,
  getAllCategories,
  updateViewHistory,
  updateLikedProduct,
  removeProductFromViewHistory,
  removeProductFromIntresections,
  updateIntrecstions,
  getTrendingProducts,
  getMostLikedProducts,
  getRecommendedProduct,
};
