import redis from "../config/redis.js";

export const cache =
    (keyPrefix, ttl = 60) =>
    async (req, res, next) => {
        const key = `${keyPrefix}:${req.user.id}`;
        const cached = await redis.get(key);

        if (cached) {
            console.log(`[CACHE HIT] ${key}`);
            return res.json(JSON.parse(cached));
        }

        console.log(`[CACHE MISS] ${key}`);

        const originalJson = res.json.bind(res);
        res.json = (data) => {
            redis.setex(key, ttl, JSON.stringify(data));
            return originalJson(data);
        };

        next();
    };
