const express = require("express");
const errorMiddleware = require("./middlewares/errorHandling");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const colors = require("colors");
colors.enable();
const cors = require("cors");

const app = express();

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  console.error(err.stack);
  process.exit(1);
});

dotenv.config({ path: "backend/config/config.env" });

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// CORS headers
// Configure CORS
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.get("/test", (req, res) => {
  res.status(200).send("<h1>This is route Route</h1>");
});

module.exports = app;
