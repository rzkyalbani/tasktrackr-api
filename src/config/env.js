import dotenv from "dotenv";
dotenv.config();

export const config = {
    port: process.env.PORT || 8080,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExp: process.env.ACCESS_TOKEN_EXP || "5m",
    refreshExp: process.env.REFRESH_TOKEN_EXP || "7d",
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisPassword: process.env.REDIS_PASSWORD,
};
