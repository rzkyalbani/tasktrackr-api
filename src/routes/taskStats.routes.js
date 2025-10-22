import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import * as TaskStatsController from "../controllers/taskStats.controller.js";

const router = Router();

router.get("/stats", authenticate, TaskStatsController.getWeeklyStats);

export default router;