import Redis from "redis";
export const redisClient = Redis.createClient({
  host: process.env.NODE_ENV === "production" ? "redis" : "localhost",
  port: 6379,
});
