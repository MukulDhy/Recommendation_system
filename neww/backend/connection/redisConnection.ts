import Redis from "ioredis";
import path from "path";
require("dotenv").config({
  path: path.resolve(__dirname, "../config/config.env"),
});
const redisUrl: string = process.env.REDIS_URL || "";
import colors from "colors";
colors.enable();

// Function to create Redis client
const createRedisClient = () => {
  // console.log(process.env.REDIS_URL);
  // console.log(process.env.REDIS);
  // console.log(process.env.REDIS);
  // console.log(redisUrl);
  if (process.env.REDIS_URL) {
    console.log(`Redis Connected to ${redisUrl}`.bgCyan.black.underline);
    return new Redis(process.env.REDIS_URL);
  } else {
    throw new Error(`Redis Connection Failed: REDIS_URL is not defined`);
  }
};

// Export the Redis client instance
export const redis = createRedisClient();
