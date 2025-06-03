const dotenv = require("dotenv");
const express = require("express");
const cloudinary = require("cloudinary").v2;
const colors = require("colors");
const connectionMongoDb = require("./database/connDataBase");
const errorMiddleware = require("./middlewares/errorHandling");

const userRoute = require("./routes/userRoutes");
const productRoute = require("./routes/productRoutes");

colors.enable();

dotenv.config({ path: "config/config.env" });

const PORT = process.env.PORT || 5000;
const app = require("./app");

connectionMongoDb();

app.use("/api/user", userRoute);
app.use("/api/products", productRoute);

app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.url}`,
  });
});

// Error handling middleware
app.use(errorMiddleware);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

console.log(
  `Cloudinary is connected to ${process.env.CLOUDINARY_NAME}`.bgCyan.black
    .underline
);

// Start server
const server = app.listen(PORT, "localhost", () => {
  console.log(
    `Server is running on http://localhost:${PORT}`.underline.bgGreen
  );
  console.log(
    `Cloudinary is connected to ${process.env.CLOUDINARY_NAME}`.bgCyan.black
      .underline
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  server.close(() => {
    process.exit(1);
  });
});
