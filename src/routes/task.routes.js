import { Router } from "express";
import * as TaskController from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authenticate, TaskController.createTask);
router.get("/", authenticate, TaskController.getTasks);
router.get("/:id", authenticate, TaskController.getTaskById);
router.put("/:id", authenticate, TaskController.updateTask);
router.delete("/:id", authenticate, TaskController.deleteTask);

export default router;
