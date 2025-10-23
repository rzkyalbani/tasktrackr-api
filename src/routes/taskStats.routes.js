import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { cache } from "../middlewares/cache.middleware.js";
import * as TaskStatsController from "../controllers/taskStats.controller.js";

const router = Router();

router.get(
    "/stats",
    authenticate,
    cache("user_stats", 60),
    TaskStatsController.getStats,
);

export default router;
