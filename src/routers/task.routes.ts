import { Router } from "express";
import {
  createTask,
  getTasks,
  editTask,
  deleteTask,
} from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { createTaskSchema, updateTaskSchema } from "../dtos/verifyTask";
const router = Router();

router.post("/", authMiddleware, validate(createTaskSchema), createTask);
router.get("/", authMiddleware, getTasks);
router.put("/:taskId", authMiddleware, validate(updateTaskSchema), editTask);
router.delete("/:taskId", authMiddleware, deleteTask);

export default router;
