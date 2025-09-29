import { Router } from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { createTaskSchema, updateTaskSchema } from "../dtos/verifyTask";
const router = Router();

router.post("/task", authMiddleware, validate(createTaskSchema), createTask);
router.get("/task/me", authMiddleware, getTasks);
router.put("/task/update/:taskId",authMiddleware, validate( updateTaskSchema), updateTask) ;
router.delete("/task/delete/:taskId",authMiddleware, deleteTask)

export default router; 