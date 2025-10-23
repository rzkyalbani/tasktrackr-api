import Redis from "ioredis";
import { config } from "../config/env.js";

const redis = new Redis({
    host: config.redisHost || "127.0.0.1",
    port: config.redisPort || 6379,
    password: config.redisPassword || undefined,
});

redis.on("connect", () => console.log("[Redis] Connected"));
redis.on("error", (err) => console.error("[Redis] Error ", err));

export default redis;
