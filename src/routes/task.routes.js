import { Router } from "express";
import * as TaskController from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    createTaskSchema,
    updateTaskSchema,
} from "../validators/task.schema.js";

const router = Router();

router.post(
    "/",
    authenticate,
    validate(createTaskSchema),
    TaskController.createTask
);
router.get("/", authenticate, TaskController.getTasks);
router.get("/:id", authenticate, TaskController.getTaskById);
router.put(
    "/:id",
    authenticate,
    validate(updateTaskSchema),
    TaskController.updateTask
);
router.delete("/:id", authenticate, TaskController.deleteTask);

export default router;
